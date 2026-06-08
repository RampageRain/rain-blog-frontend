<template>
  <footer class="blog-footer">
    <div class="footer-content">
      <p class="footer-copyright">© 2026 Rain Blog. All Rights Reserved.</p>

      <p class="footer-meta">
        <span>Powered by Vue</span>
        <span class="footer-meta-divider" aria-hidden="true">&middot;</span>
        <span>Inspired by Matery</span>
        <span class="footer-meta-divider" aria-hidden="true">&middot;</span>
        <span>Designed by Rain</span>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.blog-footer {
  width: 100%;
  min-height: 88px;
  padding: 20px 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  background: rgba(15, 23, 42, 0.24);
  border-top: 1px solid rgba(255, 255, 255, 0.32);
  box-shadow: 0 -1px 12px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
}

.footer-content {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.footer-copyright {
  margin: 0;

  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.footer-meta {
  margin: 8px 0 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
}

.footer-meta-divider {
  color: rgba(255, 255, 255, 0.44);
}

@media (max-width: 640px) {
  .blog-footer {
    min-height: 126px;
    padding: 22px 20px calc(24px + env(safe-area-inset-bottom));
  }

  .footer-meta {
    width: 168px;

    flex-direction: column;
    gap: 4px;

    line-height: 1.45;
    text-align: center;
  }

  .footer-meta-divider {
    display: none;
  }
}
</style>
