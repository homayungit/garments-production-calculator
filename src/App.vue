<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">

    <!-- ═══ HEADER ═══ -->
    <header class="fixed top-0 inset-x-0 z-40 flex items-center h-12
                   bg-primary-700 dark:bg-slate-900 border-b border-primary-800 dark:border-slate-800 shadow-sm">
      <!-- Hamburger (mobile) -->
      <button @click="drawerOpen = true"
        class="md:hidden shrink-0 w-10 h-full flex items-center justify-center text-white hover:bg-primary-600 dark:hover:bg-slate-800 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 px-3 md:px-4 flex-1 min-w-0">
        <div class="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-sm shrink-0">🧵</div>
        <span class="font-bold text-white text-sm leading-none">{{ t('app.name') }}</span>
        <span class="text-primary-200 dark:text-slate-500 text-xs hidden sm:block truncate">— {{ t('app.full') }}</span>
      </router-link>
      <!-- Controls -->
      <div class="flex items-center gap-1 px-2 shrink-0">
        <button @click="toggleDark()"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-600 dark:hover:bg-slate-800 text-primary-100 dark:text-slate-400 transition-colors"
          :title="dark ? 'Light mode' : 'Dark mode'">
          <!-- Sun -->
          <svg v-if="dark" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
          </svg>
          <!-- Moon -->
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        </button>
        <!-- Language -->
        <button @click="toggleLang()"
          class="h-8 px-2 rounded-lg text-xs font-bold border border-primary-500/40 dark:border-slate-700
                 hover:bg-primary-600 dark:hover:bg-slate-800 text-white dark:text-slate-300 transition-colors min-w-[38px]">
          {{ lang === 'en' ? 'বাং' : 'EN' }}
        </button>
      </div>
    </header>

    <!-- ═══ MOBILE OVERLAY ═══ -->
    <transition name="fade">
      <div v-if="drawerOpen" @click="drawerOpen = false"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"/>
    </transition>

    <!-- ═══ MOBILE DRAWER ═══ -->
    <transition name="slide-drawer">
      <nav v-if="drawerOpen"
        class="fixed inset-y-0 left-0 w-64 z-50 flex flex-col md:hidden
               bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 shadow-2xl">
        <div class="flex items-center gap-2.5 px-4 py-3 bg-primary-700 dark:bg-slate-950 shrink-0">
          <div class="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-base">🧵</div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-white text-sm leading-tight">{{ t('app.name') }}</div>
            <div class="text-primary-200 text-[11px] truncate">{{ t('app.full') }}</div>
          </div>
          <button @click="drawerOpen = false" class="text-primary-200 hover:text-white w-7 h-7 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto py-1.5">
          <router-link to="/" @click="drawerOpen = false"
            :class="['nav-item', $route.name === 'Home' ? 'nav-active' : '']">
            <span class="nav-icon">🏠</span><span class="truncate">{{ t('nav.allCalcs') }}</span>
          </router-link>
          <template v-for="g in navGroups" :key="g.key">
            <div class="nav-group-label">{{ t('nav.' + g.key) }}</div>
            <router-link v-for="item in g.items" :key="item.path"
              :to="item.path" @click="drawerOpen = false"
              :class="['nav-item', $route.path === item.path ? 'nav-active' : '']">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="truncate">{{ t('calc.' + item.tKey + '.title') }}</span>
            </router-link>
          </template>
        </div>
        <div class="p-3 border-t border-gray-100 dark:border-slate-800 text-[10px] text-gray-400 dark:text-slate-600 text-center shrink-0">
          {{ t('app.suite') }}
        </div>
      </nav>
    </transition>

    <!-- ═══ MAIN AREA ═══ -->
    <div class="flex flex-1 pt-12 pb-14 md:pb-0">

      <!-- Desktop sidebar -->
      <aside class="hidden md:flex flex-col fixed top-12 left-0 bottom-0 w-48
                    bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 z-30 overflow-y-auto">
        <nav class="flex-1 py-1.5">
          <router-link to="/" :class="['nav-item', $route.name === 'Home' ? 'nav-active' : '']">
            <span class="nav-icon text-sm">🏠</span>
            <span class="truncate text-[12px]">{{ t('nav.allCalcs') }}</span>
          </router-link>
          <template v-for="g in navGroups" :key="g.key">
            <div class="nav-group-label">{{ t('nav.' + g.key) }}</div>
            <router-link v-for="item in g.items" :key="item.path" :to="item.path"
              :class="['nav-item', $route.path === item.path ? 'nav-active' : '']">
              <span class="nav-icon text-sm">{{ item.icon }}</span>
              <span class="truncate text-[12px] leading-tight">{{ t('calc.' + item.tKey + '.title') }}</span>
            </router-link>
          </template>
        </nav>
        <div class="p-2 border-t border-gray-100 dark:border-slate-800 text-[10px] text-gray-300 dark:text-slate-700 text-center shrink-0">
          {{ t('app.suite') }}
        </div>
      </aside>

      <!-- Content -->
      <main class="flex-1 md:ml-48 min-h-full overflow-x-hidden">
        <!-- Home: full-width, no max-width constraint -->
        <div v-if="$route.name === 'Home'" class="h-full">
          <router-view />
        </div>
        <!-- Calculator pages: centered form -->
        <div v-else class="max-w-5xl mx-auto px-3 py-4">
          <router-view />
        </div>
      </main>
    </div>

    <!-- ═══ MOBILE BOTTOM NAV ═══ -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-40 flex h-14
                bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-lg"
      style="padding-bottom: env(safe-area-inset-bottom)">
      <router-link to="/" :class="['btab', $route.name === 'Home' ? 'btab-on' : '']">
        <span class="text-[18px] leading-none">🏠</span>
        <span>{{ t('nav.home') }}</span>
      </router-link>
      <button @click="go('production')" :class="['btab', $route.meta.category === 'production' ? 'btab-on' : '']">
        <span class="text-[18px] leading-none">🏭</span>
        <span>{{ t('nav.production') }}</span>
      </button>
      <button @click="go('efficiency')" :class="['btab', $route.meta.category === 'efficiency' ? 'btab-on' : '']">
        <span class="text-[18px] leading-none">📊</span>
        <span>{{ t('nav.efficiency') }}</span>
      </button>
      <button @click="go('quality')" :class="['btab', $route.meta.category === 'quality' ? 'btab-on' : '']">
        <span class="text-[18px] leading-none">✅</span>
        <span>{{ t('nav.quality') }}</span>
      </button>
      <button @click="go('fabric')" :class="['btab', $route.meta.category === 'fabric' ? 'btab-on' : '']">
        <span class="text-[18px] leading-none">🧵</span>
        <span>{{ t('nav.fabric') }}</span>
      </button>
    </nav>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from './composables/useTheme.js'
import { useLang }  from './composables/useLang.js'

const { dark, toggleDark } = useTheme()
const { lang, t, toggleLang } = useLang()
const drawerOpen = ref(false)
const router = useRouter()

const navGroups = [
  { key: 'production', items: [
    { path: '/line-efficiency',     icon: '📈', tKey: 'lineEff'     },
    { path: '/line-oee',            icon: '⚙️', tKey: 'lineOEE'    },
    { path: '/production-capacity', icon: '🏭', tKey: 'prodCap'    },
    { path: '/line-sah',            icon: '⏱️', tKey: 'lineSAH'    },
    { path: '/hourly-target',       icon: '🎯', tKey: 'hourly'     },
  ]},
  { key: 'efficiency', items: [
    { path: '/sam',                  icon: '📐', tKey: 'sam'          },
    { path: '/emp-efficiency',       icon: '👤', tKey: 'empEff'       },
    { path: '/emp-efficiency-multi', icon: '👥', tKey: 'empEffMulti'  },
    { path: '/labour-productivity',  icon: '💪', tKey: 'labourProd'   },
    { path: '/machine-productivity', icon: '🔧', tKey: 'machineProd'  },
  ]},
  { key: 'quality', items: [
    { path: '/dhu', icon: '🔍', tKey: 'dhu' },
  ]},
  { key: 'fabric', items: [
    { path: '/tshirt-fabric', icon: '👕', tKey: 'tshirt'    },
    { path: '/woven-fabric',  icon: '👔', tKey: 'woven'     },
    { path: '/kg-to-meter',   icon: '⚖️', tKey: 'kgToMeter' },
    { path: '/meter-to-kg',   icon: '📏', tKey: 'meterToKg' },
    { path: '/kg-to-yards',   icon: '🔄', tKey: 'kgToYards' },
  ]},
]

function go(cat) {
  const first = navGroups.flatMap(g => g.items).find(i => router.resolve(i.path).meta?.category === cat)
  if (first) router.push(first.path)
}
</script>

<style>
/* Nav items */
.nav-item {
  @apply flex items-center gap-2 mx-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer
         text-gray-500 dark:text-slate-500
         hover:bg-gray-100 dark:hover:bg-slate-800
         hover:text-gray-800 dark:hover:text-slate-200 transition-colors;
}
.nav-active {
  @apply bg-primary-50 dark:bg-primary-900/30 !text-primary-700 dark:!text-primary-400
         font-semibold border-r-2 border-primary-600 dark:border-primary-500;
}
.nav-icon { @apply shrink-0 w-4 text-center leading-none; }
.nav-group-label {
  @apply px-4 pt-3 pb-0.5 text-[9px] font-bold uppercase tracking-[0.14em]
         text-gray-400 dark:text-slate-600;
}

/* Bottom tabs */
.btab {
  @apply flex-1 flex flex-col items-center justify-center gap-0.5
         text-[10px] font-medium text-gray-400 dark:text-slate-600
         hover:text-gray-600 dark:hover:text-slate-300 transition-colors;
}
.btab-on { @apply !text-primary-600 dark:!text-primary-400; }

/* Transitions */
.fade-enter-active,.fade-leave-active { transition: opacity .2s; }
.fade-enter-from,.fade-leave-to { opacity:0; }
.slide-drawer-enter-active,.slide-drawer-leave-active { transition: transform .24s ease; }
.slide-drawer-enter-from,.slide-drawer-leave-to { transform: translateX(-100%); }
</style>
