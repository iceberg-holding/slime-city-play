import type { InputCommand } from '../sim/types';

export type ActionName = 'sticky' | 'bouncy' | 'jump' | 'place' | 'toggleShape' | 'interact' | 'trick' | 'up' | 'down';

/**
 * Turns keyboard / mouse / touch into InputCommands.
 * Camera yaw/pitch live here because they are part of what the player "asks" for (aim direction).
 */
const TAP_MOVE = 12; // px a touch may wander and still count as a tap
const TAP_TIME = 300; // ms
const DOUBLE_TAP = 260; // ms window for the second tap

export class InputController {
  camYaw = 0;
  camPitch = 0.45;
  enabled = false;
  /** classic layout: sticky/bouncy are on-screen buttons; otherwise right-half tap = sticky, double-tap = bouncy */
  classic = false;

  private keys = new Set<string>();
  private edges = new Set<ActionName>();
  private held = new Set<ActionName>();

  private joyId: number | null = null;
  private joyOrigin = { x: 0, y: 0 };
  private joy = { x: 0, y: 0 };
  private lookId: number | null = null;
  private lookLast = { x: 0, y: 0 };
  private lookStart = { x: 0, y: 0, t: 0, moved: 0 };
  /** time of a single tap waiting to see if a second one follows */
  private pendingTap = 0;
  private mouseDown: { x: number; y: number; button: number; moved: number } | null = null;

  private joyBase: HTMLDivElement;
  private joyKnob: HTMLDivElement;

  constructor(private surface: HTMLElement) {
    this.joyBase = document.createElement('div');
    this.joyBase.className = 'joy-base';
    this.joyKnob = document.createElement('div');
    this.joyKnob.className = 'joy-knob';
    this.joyBase.appendChild(this.joyKnob);
    document.body.appendChild(this.joyBase);

    window.addEventListener('keydown', (e) => this.onKey(e, true));
    window.addEventListener('keyup', (e) => this.onKey(e, false));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.held.clear();
    });
    surface.addEventListener('pointerdown', (e) => this.onDown(e));
    window.addEventListener('pointermove', (e) => this.onMove(e));
    window.addEventListener('pointerup', (e) => this.onUp(e));
    window.addEventListener('pointercancel', (e) => this.onUp(e));
    surface.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /** Called by on-screen buttons. */
  press(a: ActionName) {
    if (!this.enabled) return;
    this.edges.add(a);
    if (a === 'sticky' || a === 'bouncy' || a === 'up' || a === 'down') this.held.add(a);
  }
  release(a: ActionName) {
    this.held.delete(a);
  }

  reset() {
    this.keys.clear();
    this.edges.clear();
    this.held.clear();
    this.endJoy();
    this.lookId = null;
    this.mouseDown = null;
    this.pendingTap = 0;
  }

  private onKey(e: KeyboardEvent, down: boolean) {
    const k = e.code;
    if (down && e.repeat) {
      this.keys.add(k);
      return;
    }
    if (down) this.keys.add(k);
    else this.keys.delete(k);
    if (!this.enabled) return;
    const map: Record<string, ActionName> = {
      Space: 'jump',
      KeyJ: 'sticky',
      KeyK: 'bouncy',
      KeyE: 'place',
      KeyQ: 'toggleShape',
      KeyF: 'interact',
      KeyT: 'trick',
      KeyR: 'trick',
      Enter: 'interact',
    };
    const a = map[k];
    if (!a) return;
    e.preventDefault();
    if (down) this.press(a);
    else this.release(a);
  }

  private onDown(e: PointerEvent) {
    if (!this.enabled) return;
    if (e.pointerType === 'mouse') {
      this.mouseDown = { x: e.clientX, y: e.clientY, button: e.button, moved: 0 };
      this.lookLast = { x: e.clientX, y: e.clientY };
      return;
    }
    e.preventDefault();
    if (e.clientX < window.innerWidth * 0.45 && this.joyId === null) {
      this.joyId = e.pointerId;
      this.joyOrigin = { x: e.clientX, y: e.clientY };
      this.joy = { x: 0, y: 0 };
      this.joyBase.style.display = 'block';
      this.joyBase.style.left = `${e.clientX}px`;
      this.joyBase.style.top = `${e.clientY}px`;
      this.joyKnob.style.transform = 'translate(-50%, -50%)';
    } else if (this.lookId === null) {
      this.lookId = e.pointerId;
      this.lookLast = { x: e.clientX, y: e.clientY };
      this.lookStart = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
    }
  }

  private onMove(e: PointerEvent) {
    if (e.pointerType === 'mouse') {
      if (!this.mouseDown) return;
      const dx = e.clientX - this.lookLast.x;
      const dy = e.clientY - this.lookLast.y;
      this.mouseDown.moved += Math.abs(dx) + Math.abs(dy);
      this.lookLast = { x: e.clientX, y: e.clientY };
      this.rotate(dx * 0.006, dy * 0.005);
      return;
    }
    if (e.pointerId === this.joyId) {
      const R = 55;
      let dx = e.clientX - this.joyOrigin.x;
      let dy = e.clientY - this.joyOrigin.y;
      const d = Math.hypot(dx, dy);
      if (d > R) {
        dx = (dx / d) * R;
        dy = (dy / d) * R;
      }
      this.joy = { x: dx / R, y: dy / R };
      this.joyKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    } else if (e.pointerId === this.lookId) {
      const dx = e.clientX - this.lookLast.x;
      const dy = e.clientY - this.lookLast.y;
      this.lookLast = { x: e.clientX, y: e.clientY };
      this.lookStart.moved = Math.max(this.lookStart.moved, Math.hypot(e.clientX - this.lookStart.x, e.clientY - this.lookStart.y));
      // small jitter during a tap shouldn't swing the camera
      if (this.lookStart.moved > TAP_MOVE || this.classic) this.rotate(dx * 0.008, dy * 0.006);
    }
  }

  private onUp(e: PointerEvent) {
    if (e.pointerType === 'mouse') {
      const m = this.mouseDown;
      this.mouseDown = null;
      if (m && this.enabled && m.moved < 6 && e.target === this.surface) {
        if (m.button === 0) this.edges.add('sticky');
        else if (m.button === 2) this.edges.add('bouncy');
      }
      return;
    }
    if (e.pointerId === this.joyId) this.endJoy();
    if (e.pointerId === this.lookId) {
      this.lookId = null;
      const now = performance.now();
      const tap = this.lookStart.moved <= TAP_MOVE && now - this.lookStart.t < TAP_TIME;
      if (tap && this.enabled && !this.classic && e.type === 'pointerup') this.tap(now);
    }
  }

  /** Right-half tap: a single tap fires sticky (after the double-tap window), a double tap fires bouncy. */
  private tap(now: number) {
    if (this.pendingTap && now - this.pendingTap < DOUBLE_TAP) {
      this.pendingTap = 0;
      this.edges.add('bouncy');
    } else this.pendingTap = now;
  }

  private endJoy() {
    this.joyId = null;
    this.joy = { x: 0, y: 0 };
    this.joyBase.style.display = 'none';
  }

  /** performance.now() of the last manual camera move */
  lastLook = 0;

  rotate(dYaw: number, dPitch: number) {
    this.lastLook = performance.now();
    this.camYaw -= dYaw;
    this.camPitch = Math.max(-0.15, Math.min(1.2, this.camPitch + dPitch));
  }

  /** Build the command for the next sim tick; clears one-shot presses. */
  consume(dt: number): InputCommand {
    if (this.pendingTap && performance.now() - this.pendingTap >= DOUBLE_TAP) {
      this.pendingTap = 0;
      if (this.enabled) this.edges.add('sticky');
    }
    let sx = this.joy.x;
    let sy = -this.joy.y;
    const k = this.keys;
    if (k.has('KeyW') || k.has('ArrowUp')) sy += 1;
    if (k.has('KeyS') || k.has('ArrowDown')) sy -= 1;
    if (k.has('KeyD')) sx += 1;
    if (k.has('KeyA')) sx -= 1;
    if (k.has('ArrowLeft')) this.rotate(-dt * 2.2, 0);
    if (k.has('ArrowRight')) this.rotate(dt * 2.2, 0);
    const len = Math.hypot(sx, sy);
    if (len > 1) {
      sx /= len;
      sy /= len;
    }
    if (!this.enabled) sx = sy = 0;
    // camera-relative → world
    const fx = -Math.sin(this.camYaw);
    const fz = -Math.cos(this.camYaw);
    const rx = Math.cos(this.camYaw);
    const rz = -Math.sin(this.camYaw);
    const has = (a: ActionName) => this.edges.has(a);
    const cmd: InputCommand = {
      mx: rx * sx + fx * sy,
      mz: rz * sx + fz * sy,
      aimYaw: this.camYaw,
      jump: has('jump'),
      sticky: has('sticky') || this.held.has('sticky'),
      bouncy: has('bouncy') || this.held.has('bouncy'),
      place: has('place'),
      toggleShape: has('toggleShape'),
      interact: has('interact'),
      trick: has('trick'),
      // drone altitude: held on-screen buttons, or Space / Shift on a keyboard
      up: this.enabled && (this.held.has('up') || k.has('Space')),
      down: this.enabled && (this.held.has('down') || k.has('ShiftLeft') || k.has('ShiftRight')),
    };
    this.edges.clear();
    return cmd;
  }
}
