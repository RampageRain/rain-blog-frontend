<script setup lang="ts">
import { Icon } from '@iconify/vue'

import BlogNavbar from '@/components/blog/BlogNavbar.vue'
import BlogFooter from '@/components/blog/BlogFooter.vue'

import defaultCover from '@/assets/images/home-bg-1.jpg'
import pageBg from '@/assets/images/postlist-bg-light.jpg'

const pageStyle = {
  backgroundImage: `
    linear-gradient(rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.34)),
    url(${pageBg})
  `
}

const coverStyle = {
  backgroundImage: `
    linear-gradient(rgba(15, 23, 42, 0.24), rgba(15, 23, 42, 0.52)),
    url(${defaultCover})
  `
}
</script>

<template>
  <main class="create-post-page" :style="pageStyle">
    <BlogNavbar />

    <section id="create" class="create-post-main">
      <header class="article-head" :style="coverStyle">
        <button type="button" class="cover-upload-button">
          <Icon icon="fa-solid:image" aria-hidden="true" />
          <span>上传封面图</span>
        </button>

        <div class="article-head-content">
          <input class="title-input" placeholder="请输入文章标题" />
          <textarea class="summary-input" placeholder="请输入文章摘要，发布后会展示在文章卡片和详情页顶部"></textarea>
        </div>

        <div class="article-meta">
          <label>
            <Icon icon="fa-solid:bookmark" aria-hidden="true" />
            <input placeholder="分类" />
          </label>
          <label>
            <Icon icon="fa-regular:calendar-alt" aria-hidden="true" />
            <input placeholder="发布日期" />
          </label>
          <label>
            <Icon icon="fa-solid:tags" aria-hidden="true" />
            <input placeholder="标签" />
          </label>
        </div>
      </header>

      <article class="article-card">
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <button type="button">
              <Icon icon="fa-solid:file-import" aria-hidden="true" />
              <span>导入 MD</span>
            </button>
            <button type="button">
              <Icon icon="fa-solid:image" aria-hidden="true" />
              <span>插入图片</span>
            </button>
          </div>

          <div class="toolbar-right">
            <button type="button" class="secondary-action">保存草稿</button>
            <button type="button" class="primary-action">发布文章</button>
          </div>
        </div>

        <section class="article-content">
          <textarea
            class="markdown-input"
            placeholder="从这里开始写 Markdown 正文，或点击上方“导入 MD”载入本地 Markdown 文件。"
          ></textarea>
        </section>
      </article>
    </section>

    <BlogFooter />
  </main>
</template>

<style scoped>
.create-post-page {
  min-height: 100vh;
  min-height: 100dvh;
  color: #34495e;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
}

.create-post-main {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: 96px 0 42px;
}

.article-head {
  position: relative;
  min-height: 430px;
  padding: 88px 44px 34px;
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background-position: center;
  background-size: cover;
  box-shadow:
    0 10px 35px 2px rgba(0, 0, 0, 0.15),
    0 5px 15px rgba(0, 0, 0, 0.07),
    0 2px 5px -5px rgba(0, 0, 0, 0.1);
}

.cover-upload-button {
  position: absolute;
  top: 92px;
  right: 28px;
  z-index: 2;
  height: 38px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.56);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(12px);
  cursor: pointer;
  font-weight: 700;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.cover-upload-button:hover {
  background: rgba(15, 23, 42, 0.42);
  transform: translateY(-1px);
}

.article-head-content {
  position: relative;
  z-index: 1;
  width: min(760px, 100%);
  margin: 0 auto;
  text-align: center;
}

.title-input,
.summary-input,
.article-meta input,
.markdown-input {
  width: 100%;
  border: 0;
  outline: none;
  font-family: inherit;
}

.title-input {
  color: #ffffff;
  background: transparent;
  font-size: clamp(34px, 5vw, 58px);
  font-weight: 900;
  line-height: 1.16;
  text-align: center;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.42);
}

.title-input::placeholder,
.summary-input::placeholder {
  color: rgba(255, 255, 255, 0.84);
}

.summary-input {
  min-height: 84px;
  margin-top: 18px;
  color: rgba(248, 250, 252, 0.92);
  background: transparent;
  font-size: 16px;
  line-height: 1.8;
  text-align: center;
  resize: none;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
}

.article-meta {
  position: absolute;
  right: 28px;
  bottom: 22px;
  left: 28px;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 18px;
}

.article-meta label {
  min-width: 120px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(248, 250, 252, 0.9);
}

.article-meta svg {
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
}

.article-meta input {
  min-width: 0;
  color: #ffffff;
  background: transparent;
  font-size: 14px;
}

.article-meta input::placeholder {
  color: rgba(248, 250, 252, 0.82);
}

.article-card {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 0 0 8px 8px;
  box-shadow:
    0 10px 35px 2px rgba(0, 0, 0, 0.15),
    0 5px 15px rgba(0, 0, 0, 0.07),
    0 2px 5px -5px rgba(0, 0, 0, 0.1);
}

.editor-toolbar {
  min-height: 62px;
  padding: 12px 22px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.94);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(248, 250, 252, 0.82);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.editor-toolbar button {
  height: 38px;
  padding: 0 15px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #34495e;
  background: rgba(226, 232, 240, 0.76);
  font-weight: 800;
}

.editor-toolbar .primary-action {
  color: #ffffff;
  background: linear-gradient(to right, #0000cd 0%, #0f9d58 100%);
  box-shadow: 0 10px 22px rgba(15, 157, 88, 0.22);
}

.editor-toolbar .secondary-action {
  color: #0f9d58;
  background: rgba(220, 252, 231, 0.9);
}

.article-content {
  padding: 32px 38px 42px;
}

.markdown-input {
  min-height: 680px;
  padding: 0;
  color: #2c3e50;
  background: transparent;
  font-family: var(--blog-mono-font-family);
  font-size: 16px;
  line-height: 1.9;
  resize: vertical;
}

.markdown-input::placeholder {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .create-post-main {
    width: 100%;
    padding-top: 60px;
  }

  .article-head {
    min-height: 46vh;
    padding: 86px 18px 96px;
    border-radius: 0;
  }

  .cover-upload-button {
    top: 76px;
    right: 16px;
  }

  .article-meta {
    right: 18px;
    bottom: 24px;
    left: 18px;
    justify-content: flex-start;
  }

  .article-card {
    position: relative;
    z-index: 3;
    width: 95%;
    margin: -58px auto 0;
    border-radius: 8px;
  }

  .editor-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .article-content {
    padding: 24px 18px 30px;
  }

  .markdown-input {
    min-height: 520px;
  }
}
</style>
