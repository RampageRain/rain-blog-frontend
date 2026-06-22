<template>
  <section class="studio-paper-plane-scene" aria-hidden="true">
    <svg class="paper-flight-line" viewBox="0 0 1080 128" preserveAspectRatio="none">
      <path d="M 20 82 C 156 106, 284 60, 402 74 C 540 90, 632 118, 764 80 C 900 40, 984 62, 1064 48" />
    </svg>

    <i class="plane-triangle triangle-one"></i>
    <i class="plane-triangle triangle-two"></i>
    <i class="plane-triangle triangle-three"></i>
    <i class="plane-triangle triangle-four"></i>
    <i class="plane-triangle triangle-five"></i>
    <i class="plane-triangle triangle-six"></i>

    <span class="paper-plane">
      <svg viewBox="0 0 64 64" focusable="false">
        <path class="plane-face" d="M58 32 7 12l13 20L7 52 58 32Z" />
        <path class="plane-wing-top" d="M20 32 58 32 7 12l13 20Z" />
        <path class="plane-wing-bottom" d="M20 32 7 52 58 32H20Z" />
        <path class="plane-fold" d="M20 32 31 40 58 32H20Z" />
        <path class="plane-stroke" d="M58 32 7 12l13 20L7 52 58 32ZM20 32h38" />
      </svg>
    </span>
  </section>
</template>

<style scoped>
.studio-paper-plane-scene {
  position: relative;
  min-height: 118px;
  overflow: hidden;
  isolation: isolate;
  pointer-events: none;
  background:
    radial-gradient(circle at 16% 76%, rgba(255, 255, 255, 0.58), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(248, 250, 252, 0.34) 68%, rgba(241, 245, 249, 0.52) 100%);
}

:global(.is-night-theme) .studio-paper-plane-scene {
  background:
    radial-gradient(circle at 16% 78%, rgba(148, 163, 184, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.32) 68%, rgba(15, 23, 42, 0.58) 100%);
}

.paper-flight-line {
  position: absolute;
  left: 2%;
  right: 2%;
  bottom: 6px;
  z-index: 1;
  width: 96%;
  height: 96px;
  overflow: visible;
  opacity: 0.66;
}

.paper-flight-line path {
  fill: none;
  stroke: rgba(100, 116, 139, 0.22);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 3 16;
  animation: paper-line-drift 9s linear infinite;
}

:global(.is-night-theme) .paper-flight-line path {
  stroke: rgba(203, 213, 225, 0.2);
}

.paper-plane {
  position: absolute;
  left: -6%;
  bottom: 24px;
  z-index: 3;
  width: 40px;
  height: 40px;
  display: block;
  opacity: 0;
  transform-origin: 50% 50%;
  filter: drop-shadow(0 9px 14px rgba(15, 23, 42, 0.12));
  animation: paper-plane-fly 12.5s cubic-bezier(0.42, 0, 0.2, 1) infinite;
  will-change: left, bottom, transform, opacity;
}

.paper-plane svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}

.plane-face,
.plane-wing-top {
  fill: rgba(255, 255, 255, 0.94);
}

.plane-wing-bottom {
  fill: rgba(248, 250, 252, 0.94);
}

.plane-fold {
  fill: rgba(148, 163, 184, 0.16);
}

.plane-stroke {
  fill: none;
  stroke: rgba(71, 85, 105, 0.23);
  stroke-width: 1.15;
  stroke-linecap: round;
  stroke-linejoin: round;
}

:global(.is-night-theme) .plane-wing-bottom {
  fill: rgba(226, 232, 240, 0.92);
}

:global(.is-night-theme) .plane-stroke {
  stroke: rgba(226, 232, 240, 0.36);
}

.plane-triangle {
  --triangle-rotate: 0deg;
  --triangle-size: 1;

  position: absolute;
  z-index: 2;
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-bottom: 7px solid rgba(100, 116, 139, 0.2);
  border-left: 4px solid transparent;
  opacity: 0.32;
  filter: drop-shadow(0 3px 5px rgba(15, 23, 42, 0.06));
  transform: rotate(var(--triangle-rotate)) scale(var(--triangle-size));
  animation: paper-triangle-float 5.6s ease-in-out infinite;
}

:global(.is-night-theme) .plane-triangle {
  border-bottom-color: rgba(203, 213, 225, 0.2);
}

.triangle-one {
  left: 12%;
  bottom: 76px;
  --triangle-rotate: -22deg;
  --triangle-size: 0.76;
  animation-delay: -1.2s;
}

.triangle-two {
  left: 28%;
  bottom: 54px;
  --triangle-rotate: 34deg;
  --triangle-size: 0.62;
  animation-delay: -3.4s;
}

.triangle-three {
  left: 43%;
  bottom: 70px;
  --triangle-rotate: 12deg;
  --triangle-size: 0.74;
  animation-delay: -2s;
}

.triangle-four {
  left: 60%;
  bottom: 46px;
  --triangle-rotate: -46deg;
  --triangle-size: 0.66;
  animation-delay: -4.2s;
}

.triangle-five {
  left: 75%;
  bottom: 66px;
  --triangle-rotate: 28deg;
  --triangle-size: 0.84;
  animation-delay: -0.8s;
}

.triangle-six {
  left: 90%;
  bottom: 57px;
  --triangle-rotate: -14deg;
  --triangle-size: 0.58;
  animation-delay: -2.8s;
}

@keyframes paper-plane-fly {
  0% {
    left: -6%;
    bottom: 24px;
    opacity: 0;
    transform: translate(-50%, 50%) rotate(4deg) scale(0.94);
  }

  9% {
    opacity: 0.82;
  }

  24% {
    left: 18%;
    bottom: 64px;
    transform: translate(-50%, 50%) rotate(-9deg) scale(1);
  }

  43% {
    left: 40%;
    bottom: 52px;
    transform: translate(-50%, 50%) rotate(5deg) scale(0.98);
  }

  61% {
    left: 61%;
    bottom: 30px;
    transform: translate(-50%, 50%) rotate(12deg) scale(1);
  }

  79% {
    left: 82%;
    bottom: 62px;
    transform: translate(-50%, 50%) rotate(-6deg) scale(1);
  }

  92% {
    opacity: 0.82;
  }

  100% {
    left: 106%;
    bottom: 44px;
    opacity: 0;
    transform: translate(-50%, 50%) rotate(-2deg) scale(0.94);
  }
}

@keyframes paper-line-drift {
  to {
    stroke-dashoffset: -76;
  }
}

@keyframes paper-triangle-float {
  0%,
  100% {
    opacity: 0.22;
    transform: translate3d(0, 0, 0) rotate(var(--triangle-rotate)) scale(var(--triangle-size));
  }

  50% {
    opacity: 0.5;
    transform: translate3d(6px, -8px, 0) rotate(calc(var(--triangle-rotate) + 14deg)) scale(var(--triangle-size));
  }
}

@media (prefers-reduced-motion: reduce) {
  .paper-flight-line path,
  .paper-plane,
  .plane-triangle {
    animation: none;
  }

  .paper-plane {
    left: 72%;
    bottom: 55px;
    opacity: 0.72;
    transform: translate(-50%, 50%) rotate(-6deg);
  }
}

@media (max-height: 760px) {
  .studio-paper-plane-scene {
    min-height: 92px;
  }

  .paper-flight-line {
    bottom: 0;
    height: 76px;
  }

  .paper-plane {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 820px) {
  .studio-paper-plane-scene {
    min-height: 92px;
  }

  .paper-flight-line {
    left: 0;
    right: 0;
    width: 100%;
    height: 74px;
  }

  .paper-plane {
    width: 34px;
    height: 34px;
    animation-duration: 10.5s;
  }

  .triangle-five,
  .triangle-six {
    display: none;
  }
}
</style>
