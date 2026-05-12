<script setup lang="ts">
import BlogNavbar from '@/components/blog/BlogNavbar.vue'

import postCover1 from '@/assets/images/home-bg-1.jpg'
import postCover2 from '@/assets/images/home-bg-2.jpg'
import postCover3 from '@/assets/images/home-bg-3.jpg'
import postCover4 from '@/assets/images/home-bg-4.jpg'
import postCover5 from '@/assets/images/home-bg-5.jpg'
import postCover6 from '@/assets/images/home-bg-6.jpg'
import quoteBg from '@/assets/images/intro-card-img.jpg'
import avatar from '@/assets/images/avart.jpg'

interface Post {
  id: number
  title: string
  summary: string
  category: string
  tags: string[]
  date: string
  views: number
  cover: string
}

interface ProfileStat {
  type: 'article' | 'category' | 'tag' | 'view'
  label: string
  value: string
}

interface IntroMeta {
  type: 'location' | 'writing' | 'code'
  text: string
}

const posts: Post[] = [
  {
    id: 1,
    title: 'Spring Boot 3.2 新特性探索',
    summary:
      '记录 Spring Boot 3.2 中的一些重要更新与实践，包括性能优化、Starter 配置变化等内容。',
    category: '后端开发',
    tags: ['Spring Boot', 'Java', '后端'],
    date: '2026-05-08',
    views: 1200,
    cover: postCover1
  },
  {
    id: 2,
    title: 'Vue 3 响应式原理理解',
    summary:
      '从 ref、computed、watch 到组件通信，系统梳理 Vue 3 响应式开发的核心概念。',
    category: '前端开发',
    tags: ['Vue 3', 'TypeScript', '前端'],
    date: '2026-05-08',
    views: 856,
    cover: postCover2
  },
  {
    id: 3,
    title: 'MySQL 索引优化实战',
    summary:
      '通过实际案例理解 MySQL 索引设计、执行计划分析和慢查询优化思路。',
    category: '数据库',
    tags: ['MySQL', '索引', '性能优化'],
    date: '2026-05-07',
    views: 1100,
    cover: postCover3
  },
  {
    id: 4,
    title: 'Redis 缓存在博客系统中的应用',
    summary:
      '记录 Redis 在访问统计、登录态保存、热门文章缓存等场景中的使用方式。',
    category: '缓存中间件',
    tags: ['Redis', '缓存', '中间件'],
    date: '2026-05-07',
    views: 732,
    cover: postCover4
  },
  {
    id: 5,
    title: 'Docker 入门到博客部署',
    summary:
      '从 Docker 基础概念到前后端分离项目部署，整理容器化部署的核心流程。',
    category: '运维部署',
    tags: ['Docker', '部署'],
    date: '2026-05-06',
    views: 645,
    cover: postCover5
  },
  {
    id: 6,
    title: '设计一个高并发博客系统',
    summary:
      '从系统设计角度思考个人博客如何支持高可用、可扩展和高并发访问。',
    category: '未分类',
    tags: [],
    date: '2026-05-05',
    views: 1500,
    cover: postCover6
  }
]

const introMetas: IntroMeta[] = [
  {
    type: 'location',
    text: '中国'
  },
  {
    type: 'writing',
    text: '持续创作中'
  },
  {
    type: 'code',
    text: '代码即生活'
  }
]

const profileStats: ProfileStat[] = [
  {
    type: 'article',
    label: '文章',
    value: '6'
  },
  {
    type: 'category',
    label: '分类',
    value: '5'
  },
  {
    type: 'tag',
    label: '标签',
    value: '12'
  },
  {
    type: 'view',
    label: '访问',
    value: '1.2k'
  }
]

const quoteStyle = {
  backgroundImage: `
    linear-gradient(
      135deg,
      rgba(15, 23, 42, 0.64),
      rgba(15, 23, 42, 0.36)
    ),
    url(${quoteBg})
  `
}
</script>

<template>
  <main class="posts-page">
    <BlogNavbar />

    <section class="posts-content">
      <section class="intro-card">
        <div class="intro-layout">
          <div class="intro-info-panel">
            <div class="avatar-wrapper">
              <img class="intro-avatar" :src="avatar" alt="Rain Blog" />
            </div>

            <div class="intro-basic">
              <h2>Rain</h2>

              <p class="intro-role">
                全栈开发者 · 技术记录者 · 探索者
              </p>

              <p class="intro-signature">
                记录 Java 后端、Vue 前端与全栈成长，分享学习心得和项目实践。
              </p>

              <div class="intro-meta">
          <span
            v-for="meta in introMetas"
            :key="meta.text"
            class="intro-meta-item"
          >
            <svg
              v-if="meta.type === 'location'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11z" />
              <circle cx="12" cy="10" r="2.2" />
            </svg>

            <svg
              v-else-if="meta.type === 'writing'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M5 5.5h11.5a2.5 2.5 0 0 1 0 5H5z" />
              <path d="M5 10.5h10.5a2.5 2.5 0 0 1 0 5H5z" />
              <path d="M5 15.5h9a2.5 2.5 0 0 1 0 5H5z" />
            </svg>

            <svg
              v-else
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m9 7-5 5 5 5" />
              <path d="m15 7 5 5-5 5" />
              <path d="m13 5-2 14" />
            </svg>

            <span>{{ meta.text }}</span>
          </span>
              </div>
            </div>

            <div class="profile-stats">
              <div
                v-for="stat in profileStats"
                :key="stat.label"
                class="profile-stat"
              >
          <span class="stat-icon">
            <svg
              v-if="stat.type === 'article'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M7 4h7l4 4v12H7z" />
              <path d="M14 4v5h5" />
              <path d="M9.5 13h7" />
              <path d="M9.5 16h5" />
            </svg>

            <svg
              v-else-if="stat.type === 'category'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M4 7.5h6l1.7 2H20v8.5H4z" />
              <path d="M4 7.5v-1.5h5.2l1.7 2H20v2" />
            </svg>

            <svg
              v-else-if="stat.type === 'tag'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M4 11.2V5h6.2L20 14.8 14.8 20z" />
              <circle cx="8.4" cy="8.4" r="1.4" />
            </svg>

            <svg
              v-else
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3.5 12s3.2-5.5 8.5-5.5S20.5 12 20.5 12s-3.2 5.5-8.5 5.5S3.5 12 3.5 12z" />
              <circle cx="12" cy="12" r="2.8" />
            </svg>
          </span>

                <div class="stat-content">
                  <strong>{{ stat.value }}</strong>
                  <span>{{ stat.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="intro-image-panel" :style="quoteStyle">
            <div class="intro-image-mask">
              <span class="quote-mark">“</span>
              <p>
                保持热爱，奔赴山海；在代码的世界里，不断成长。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="posts-container">
        <article
          v-for="post in posts"
          :key="post.id"
          class="post-card"
        >
          <div class="post-cover">
            <img :src="post.cover" :alt="post.title" />

            <div class="post-cover-mask">
              <h2 class="post-cover-title">
                {{ post.title }}
              </h2>
            </div>
          </div>

          <div class="post-content">
            <p class="post-summary">
              {{ post.summary }}
            </p>

            <div class="post-meta">
              <span>{{ post.date }}</span>
              <span>{{ post.views }} 阅读</span>
            </div>

            <div
              class="post-card-action"
              :class="{ 'is-empty': !post.category && post.tags.length === 0 }"
            >
              <div class="article-tags">
                <span
                  v-if="post.category"
                  class="chip bg-color"
                  :class="{ 'grey-chip': post.category === '未分类' }"
                >
                  {{ post.category }}
                </span>

                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="chip bg-color"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<style scoped>
.posts-page {
  position: relative;
  min-height: 100vh;
  padding-top: 96px;

  background:
    linear-gradient(
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.4)
    ),
    url('@/assets/images/home-bg-1.jpg') center / cover fixed no-repeat;
}

.posts-content {
  position: relative;
  z-index: 1;

  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding-bottom: 86px;
}

.intro-card {
  width: 100%;
  margin-bottom: 34px;
  padding: 0;
  border-radius: 24px;

  overflow: hidden;

  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(16px);
}

.intro-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 34px;
  align-items: stretch;
}

.intro-info-panel {
  min-width: 0;
  padding: 42px 38px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.avatar-wrapper {
  position: relative;

  width: 132px;
  height: 132px;
  padding: 5px;
  border-radius: 50%;

  flex-shrink: 0;

  background: rgba(226, 232, 240, 0.86);
  box-shadow:
    0 14px 34px rgba(15, 23, 42, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);
}

.avatar-wrapper::after {
  content: '';

  position: absolute;
  right: 12px;
  bottom: 12px;

  width: 18px;
  height: 18px;
  border-radius: 50%;

  background: linear-gradient(135deg, #0430f9, #65368b);
  border: 3px solid #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
}

.intro-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;

  object-fit: cover;
  background: #f8fafc;
}

.intro-basic {
  margin-top: 18px;
  text-align: center;
}

.intro-basic h2 {
  margin: 0;

  color: #0f172a;
  font-size: 42px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.intro-role {
  margin: 10px 0 0;

  color: #0430f9;
  font-size: 16px;
  font-weight: 700;
}

.intro-signature {
  max-width: 560px;
  margin: 16px auto 0;

  color: #475569;
  font-size: 16px;
  line-height: 1.9;
}

.intro-meta {
  margin-top: 20px;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;

  color: #64748b;
  font-size: 14px;
}

.intro-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.intro-meta-item svg {
  width: 16px;
  height: 16px;

  fill: none;
  stroke: rgba(15, 23, 42, 0.58);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.profile-stats {
  width: 100%;
  margin-top: 30px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.profile-stat {
  min-height: 82px;
  padding: 16px 14px;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  background: rgba(248, 250, 252, 0.8);
  box-shadow:
    inset 0 0 0 1px rgba(226, 232, 240, 0.9),
    0 10px 24px rgba(15, 23, 42, 0.06);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.profile-stat:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 0 0 1px rgba(99, 102, 241, 0.22),
    0 14px 30px rgba(15, 23, 42, 0.1);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: rgba(15, 23, 42, 0.72);

  background:
    linear-gradient(
      135deg,
      rgba(248, 250, 252, 0.96),
      rgba(226, 232, 240, 0.72)
    );
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.82),
    0 6px 18px rgba(15, 23, 42, 0.08);
}

.stat-icon svg {
  width: 21px;
  height: 21px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-content strong {
  color: #0f172a;
  font-size: 23px;
  font-weight: 900;
  line-height: 1;
}

.stat-content span {
  color: #64748b;
  font-size: 14px;
}

.intro-image-panel {
  min-height: 360px;

  overflow: hidden;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  box-shadow: none;
}

.intro-image-mask {
  width: 100%;
  height: 100%;
  padding: 34px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  background:
    linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.08),
      rgba(15, 23, 42, 0.72)
    );
}

.quote-mark {
  color: rgba(255, 255, 255, 0.72);
  font-size: 54px;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 4px 14px rgba(15, 23, 42, 0.42);
}

.intro-image-mask p {
  margin: 8px 0 0;

  color: rgba(255, 255, 255, 0.92);
  font-size: 17px;
  line-height: 1.9;
  text-shadow: 0 3px 12px rgba(15, 23, 42, 0.5);
}

/* 统计卡片 */
.profile-stats {
  margin-top: 34px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.profile-stat {
  min-height: 92px;
  padding: 18px 20px;
  border-radius: 18px;

  display: flex;
  align-items: center;
  gap: 16px;

  background: rgba(248, 250, 252, 0.8);
  box-shadow:
    inset 0 0 0 1px rgba(226, 232, 240, 0.9),
    0 10px 24px rgba(15, 23, 42, 0.06);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.profile-stat:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 0 0 1px rgba(99, 102, 241, 0.22),
    0 14px 30px rgba(15, 23, 42, 0.1);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: rgba(15, 23, 42, 0.72);

  background:
    linear-gradient(
      135deg,
      rgba(248, 250, 252, 0.96),
      rgba(226, 232, 240, 0.72)
    );
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.82),
    0 6px 18px rgba(15, 23, 42, 0.08);
}

.stat-icon svg {
  width: 22px;
  height: 22px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-content strong {
  color: #0f172a;
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
}

.stat-content span {
  color: #64748b;
  font-size: 14px;
}

/* 文章卡片 */
.posts-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.post-card {
  overflow: hidden;
  border-radius: 8px;

  display: flex;
  flex-direction: column;

  background: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 15px 35px rgba(50, 50, 93, 0.1),
    0 5px 15px rgba(0, 0, 0, 0.07);
  backdrop-filter: blur(10px);

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 18px 38px rgba(50, 50, 93, 0.14),
    0 8px 18px rgba(0, 0, 0, 0.09);
}

.post-cover {
  position: relative;
  overflow: hidden;

  border-radius: 8px 8px 0 0;
}

.post-cover img {
  width: 100%;
  height: auto;
  display: block;
  
  object-fit: contain;
  object-position: center;

  transition: transform 0.3s ease;
}

.post-card:hover .post-cover img {
  transform: scale(1.05);
}

.post-cover-mask {
  position: absolute;
  inset: auto 0 0;

  padding: 46px 18px 18px;

  background:
    linear-gradient(
      180deg,
      rgba(15, 23, 42, 0),
      rgba(15, 23, 42, 0.62) 42%,
      rgba(15, 23, 42, 0.86)
    );
}

.post-cover-title {
  margin: 0;

  color: #ffffff;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.35;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-content {
  min-height: 0;
  padding: 15px 15px 14px 18px;

  display: flex;
  flex-direction: column;
}

.post-summary {
  min-height: 50px;
  margin: 0;

  color: #64748b;
  line-height: 1.8;
  font-size: 14px;
  word-break: break-all;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-meta {
  margin-top: 12px;

  display: flex;
  justify-content: space-between;

  color: #94a3b8;
  font-size: 13px;
}

.post-card-action {
  position: relative;

  min-height: 0;
  margin-top: 6px;
  padding: 4px 0 0;

  display: flex;
  align-items: center;

  border-radius: 0 0 8px 8px !important;
  box-sizing: border-box;
}

/* 用伪元素画完整分割线，不受 padding 影响 */
.post-card-action::before {
  content: '';

  position: absolute;
  top: 0;
  left: -18px;
  right: -15px;

  height: 1px;
  background: rgb(139 139 139 / 0.2);
}

.post-card-action.is-empty {
  visibility: hidden;
}

.article-tags {
  width: 100%;
  min-height: 0;
  margin-top: 10px;

  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;

  padding: 0;
}

.article-tags .chip {
  margin: 0;
  padding: 0 10px !important;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 22px;
  height: 22px;
  line-height: 1 !important;
  border-radius: 10px;

  color: #fff;
  font-size: 0.8rem;
  font-weight: 400;
  white-space: nowrap;
}


.bg-color {
  background-image: linear-gradient(to right, #60d0df 0%, #0101fe 100%);
}

/* 未分类弱化，但仍保持 chip 形态 */
.grey-chip {

  background-image: linear-gradient(to right, #f1f5f9 0%, #3f3f3f 100%) !important;
}

@media (max-width: 980px) {
  .intro-main {
    grid-template-columns: 1fr;
  }

  .intro-quote {
    min-height: auto;
  }

  .posts-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .posts-page {
    padding-top: 84px;
  }

  .posts-content {
    width: min(100% - 32px, 1180px);
    padding-bottom: 64px;
  }

  .intro-card {
    padding: 30px 22px;
  }

  .intro-left {
    flex-direction: column;
    text-align: center;
  }

  .avatar-wrapper {
    width: 112px;
    height: 112px;
  }

  .intro-basic h2 {
    font-size: 34px;
  }

  .intro-meta {
    justify-content: center;
  }

  .profile-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .profile-stat {
    min-height: 86px;
  }

  .posts-container {
    grid-template-columns: 1fr;
  }

  .post-content {
    min-height: 0;
  }
}
</style>
