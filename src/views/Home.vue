<template>
  <div class="min-h-full bg-gray-50 dark:bg-slate-950">

    <!-- ═══════════ HERO ═══════════ -->
    <div class="hero-gradient relative overflow-hidden px-5 pt-6 pb-7">
      <!-- Animated dot mesh -->
      <div class="dot-mesh absolute inset-0"/>
      <!-- Glow orbs -->
      <div class="absolute -top-16 -right-16 w-72 h-72 bg-primary-400 rounded-full blur-[80px] opacity-20 pointer-events-none"/>
      <div class="absolute -bottom-10 -left-10 w-56 h-56 bg-cyan-400 rounded-full blur-[70px] opacity-15 pointer-events-none"/>
      <div class="absolute top-1/2 left-1/2 w-40 h-40 bg-emerald-500 rounded-full blur-[90px] opacity-10 pointer-events-none -translate-x-1/2 -translate-y-1/2"/>

      <div class="relative flex items-start justify-between gap-4">
        <!-- Left content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm border border-white/10">🧵</div>
            <span class="text-primary-300 text-[10px] font-bold uppercase tracking-[0.18em]">OCS Calculator Suite</span>
          </div>
          <h1 class="text-2xl font-black text-white leading-tight tracking-tight">
            {{ t('home.title') }}
          </h1>
          <p class="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-sm">
            {{ t('home.tagline') }}
          </p>
          <!-- Category pills -->
          <div class="flex flex-wrap gap-1.5 mt-3">
            <span v-for="pill in statPills" :key="pill" class="hero-pill">{{ pill }}</span>
          </div>
        </div>

        <!-- Big number badge -->
        <div class="shrink-0 text-right">
          <div class="relative">
            <div class="text-7xl font-black leading-none text-white/[0.06] select-none">16</div>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="text-3xl font-black text-white/80 leading-none">16</div>
              <div class="text-[9px] text-primary-300 uppercase tracking-[0.2em] mt-0.5">tools</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════ CALCULATOR GROUPS ═══════════ -->
    <div class="px-3 pt-4 pb-5 space-y-5">

      <div v-for="group in groups" :key="group.tKey">

        <!-- Section header -->
        <div class="flex items-center gap-2 mb-2.5">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border" :class="group.labelCls">
            <span class="text-sm leading-none">{{ group.icon }}</span>
            <span>{{ t('nav.' + group.tKey) }}</span>
          </div>
          <div class="flex-1 h-px" :class="group.lineCls"/>
          <span class="text-[10px] font-semibold tabular-nums" :class="group.cntCls">{{ group.items.length }}</span>
        </div>

        <!-- Card grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          <router-link
            v-for="item in group.items" :key="item.path" :to="item.path"
            class="group relative bg-white dark:bg-slate-800/90 rounded-2xl overflow-hidden
                   border border-gray-100/80 dark:border-slate-700/80
                   shadow-sm transition-all duration-200 ease-out cursor-pointer
                   hover:-translate-y-1 hover:shadow-xl"
            :class="group.cardHover">

            <!-- Gradient strip top -->
            <div class="h-[3px] w-full" :class="group.strip"/>

            <!-- Card body -->
            <div class="p-3 pt-2.5">
              <!-- Icon badge -->
              <div class="w-10 h-10 rounded-xl mb-2.5 flex items-center justify-center text-xl shadow-md transition-transform duration-200 group-hover:scale-110"
                :class="group.iconBg">
                {{ t('calc.' + item.tKey + '.icon') }}
              </div>
              <!-- Title -->
              <p class="text-[12px] font-bold leading-tight line-clamp-2 transition-colors duration-150"
                :class="group.titleCls">
                {{ t('calc.' + item.tKey + '.title') }}
              </p>
            </div>

            <!-- Hover shimmer -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              :class="group.shimmer"/>
          </router-link>
        </div>
      </div>

      <p class="text-center text-[10px] text-gray-300 dark:text-slate-700 pt-2">
        {{ t('home.footer') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLang } from '../composables/useLang.js'

const { t, lang } = useLang()

const statPills = computed(() => lang.value === 'en'
  ? ['🏭 5 Production', '📊 5 Efficiency', '✅ 1 Quality', '🧵 5 Fabric']
  : ['🏭 ৫টি প্রোডাকশন', '📊 ৫টি দক্ষতা', '✅ ১টি মান', '🧵 ৫টি কাপড়'])

const groups = [
  {
    tKey: 'production', icon: '🏭',
    labelCls: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    lineCls:  'bg-gradient-to-r from-blue-100 to-transparent dark:from-blue-900/30 dark:to-transparent',
    cntCls:   'text-blue-400 dark:text-blue-600',
    strip:    'bg-gradient-to-r from-blue-500 to-cyan-400',
    iconBg:   'bg-gradient-to-br from-blue-500 to-cyan-400',
    cardHover:'hover:shadow-blue-200/60 dark:hover:shadow-blue-900/60',
    shimmer:  'bg-gradient-to-br from-blue-50/80 to-transparent dark:from-blue-500/5 dark:to-transparent',
    titleCls: 'text-gray-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300',
    items: [
      { path: '/line-efficiency',     tKey: 'lineEff'    },
      { path: '/line-oee',            tKey: 'lineOEE'   },
      { path: '/production-capacity', tKey: 'prodCap'   },
      { path: '/line-sah',            tKey: 'lineSAH'   },
      { path: '/hourly-target',       tKey: 'hourly'    },
    ],
  },
  {
    tKey: 'efficiency', icon: '📊',
    labelCls: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    lineCls:  'bg-gradient-to-r from-emerald-100 to-transparent dark:from-emerald-900/30 dark:to-transparent',
    cntCls:   'text-emerald-400 dark:text-emerald-600',
    strip:    'bg-gradient-to-r from-emerald-500 to-green-400',
    iconBg:   'bg-gradient-to-br from-emerald-500 to-green-400',
    cardHover:'hover:shadow-emerald-200/60 dark:hover:shadow-emerald-900/60',
    shimmer:  'bg-gradient-to-br from-emerald-50/80 to-transparent dark:from-emerald-500/5 dark:to-transparent',
    titleCls: 'text-gray-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
    items: [
      { path: '/sam',                  tKey: 'sam'         },
      { path: '/emp-efficiency',       tKey: 'empEff'      },
      { path: '/emp-efficiency-multi', tKey: 'empEffMulti' },
      { path: '/labour-productivity',  tKey: 'labourProd'  },
      { path: '/machine-productivity', tKey: 'machineProd' },
    ],
  },
  {
    tKey: 'quality', icon: '✅',
    labelCls: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-800',
    lineCls:  'bg-gradient-to-r from-orange-100 to-transparent dark:from-orange-900/30 dark:to-transparent',
    cntCls:   'text-orange-400 dark:text-orange-600',
    strip:    'bg-gradient-to-r from-orange-500 to-amber-400',
    iconBg:   'bg-gradient-to-br from-orange-500 to-amber-400',
    cardHover:'hover:shadow-orange-200/60 dark:hover:shadow-orange-900/60',
    shimmer:  'bg-gradient-to-br from-orange-50/80 to-transparent dark:from-orange-500/5 dark:to-transparent',
    titleCls: 'text-gray-800 dark:text-slate-200 group-hover:text-orange-700 dark:group-hover:text-orange-300',
    items: [
      { path: '/dhu', tKey: 'dhu' },
    ],
  },
  {
    tKey: 'fabric', icon: '🧵',
    labelCls: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-800',
    lineCls:  'bg-gradient-to-r from-violet-100 to-transparent dark:from-violet-900/30 dark:to-transparent',
    cntCls:   'text-violet-400 dark:text-violet-600',
    strip:    'bg-gradient-to-r from-violet-500 to-purple-400',
    iconBg:   'bg-gradient-to-br from-violet-500 to-purple-400',
    cardHover:'hover:shadow-violet-200/60 dark:hover:shadow-violet-900/60',
    shimmer:  'bg-gradient-to-br from-violet-50/80 to-transparent dark:from-violet-500/5 dark:to-transparent',
    titleCls: 'text-gray-800 dark:text-slate-200 group-hover:text-violet-700 dark:group-hover:text-violet-300',
    items: [
      { path: '/tshirt-fabric', tKey: 'tshirt'    },
      { path: '/woven-fabric',  tKey: 'woven'     },
      { path: '/kg-to-meter',   tKey: 'kgToMeter' },
      { path: '/meter-to-kg',   tKey: 'meterToKg' },
      { path: '/kg-to-yards',   tKey: 'kgToYards' },
    ],
  },
]
</script>

<style scoped>
/* Animated hero gradient */
.hero-gradient {
  background: linear-gradient(135deg, #0f172a 0%, #14532d 40%, #166534 70%, #0f172a 100%);
  background-size: 300% 300%;
  animation: hero-pan 12s ease-in-out infinite;
}
@keyframes hero-pan {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}

/* Dot mesh pattern */
.dot-mesh {
  background-image: radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px);
  background-size: 22px 22px;
}

/* Hero stat pills */
.hero-pill {
  @apply text-[10px] font-semibold px-2.5 py-1 rounded-full
         bg-white/10 text-slate-300 border border-white/10 backdrop-blur-sm;
}
</style>
