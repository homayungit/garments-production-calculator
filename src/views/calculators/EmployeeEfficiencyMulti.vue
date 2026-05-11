<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.empEffMulti.icon') }} {{ t('calc.empEffMulti.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.empEffMulti.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <label class="calc-label">{{ t('lbl.totalWorkingTime') }} <span class="text-red-500">*</span></label>
        <input v-model.number="workingMinutes" type="number" min="1" step="1" placeholder="e.g. 480" class="calc-input" />
      </div>

      <div class="section-card mb-3">
        <div class="flex items-center justify-between mb-3">
          <div class="section-title !mb-0">{{ t('sec.inputs') }}</div>
          <button @click="addRow"
            class="text-xs bg-primary-600 hover:bg-primary-700 text-white px-2.5 py-1.5 rounded-lg transition-colors">
            {{ t('btn.addOp') }}
          </button>
        </div>
        <div class="space-y-2.5">
          <div v-for="(row, i) in rows" :key="i" class="flex gap-2 items-start">
            <div class="flex-1 min-w-0">
              <input v-model="row.name" type="text"
                :placeholder="t('lbl.opNamePlaceholder') + ' ' + (i + 1)"
                class="calc-input mb-1.5 text-xs" />
              <div class="grid grid-cols-2 gap-1.5">
                <input v-model.number="row.pieces" type="number" min="0" step="1"
                  placeholder="Pieces" class="calc-input text-xs" />
                <input v-model.number="row.sam" type="number" min="0" step="0.01"
                  placeholder="SAM (min)" class="calc-input text-xs" />
              </div>
            </div>
            <button v-if="rows.length > 1" @click="removeRow(i)"
              class="mt-8 p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-4">
          <button @click="calculate" class="calc-btn">{{ t('btn.calculate') }}</button>
          <button @click="reset" class="calc-btn-secondary">{{ t('btn.reset') }}</button>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="section-card">
        <div class="section-title">{{ t('sec.results') }}</div>
        <div class="result-box text-center mb-3">
          <div class="result-value">{{ result.efficiency }}%</div>
          <div class="result-label">{{ t('res.overallEfficiency') }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div class="result-card">
            <div class="result-card-value">{{ result.totalSAMEarned }}</div>
            <div class="result-card-label">{{ t('res.totalSAMEarned') }}</div>
          </div>
          <div class="result-card">
            <div class="result-card-value">{{ result.totalPieces }}</div>
            <div class="result-card-label">{{ t('res.totalPieces') }}</div>
          </div>
        </div>
        <div class="section-title">{{ t('sec.breakdown') }}</div>
        <div class="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
          <div class="grid grid-cols-4 bg-gray-50 dark:bg-slate-700/50 px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase">
            <span class="col-span-1">{{ t('lbl.opName') }}</span>
            <span class="text-center">Pcs</span><span class="text-center">SAM</span><span class="text-center">Earned</span>
          </div>
          <div v-for="(row, i) in result.breakdown" :key="i"
            class="grid grid-cols-4 px-3 py-2 text-xs border-t border-gray-100 dark:border-slate-700">
            <span class="col-span-1 truncate text-gray-700 dark:text-slate-300">{{ row.name }}</span>
            <span class="text-center text-gray-600 dark:text-slate-400">{{ row.pieces }}</span>
            <span class="text-center text-gray-600 dark:text-slate-400">{{ row.sam }}</span>
            <span class="text-center font-semibold text-primary-700 dark:text-primary-400">{{ row.earned }}</span>
          </div>
        </div>
        <div class="formula-box">
          Total SAM Earned = Σ (Pieces_i × SAM_i)<br>
          Efficiency = (Total SAM Earned / Working Time) × 100
        </div>
      </div>
      <div v-if="error" class="error-box mt-3">{{ error }}</div>
    </template>
  </CalcLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useLang } from '../../composables/useLang.js'
import CalcLayout from '../../components/CalcLayout.vue'

const { t } = useLang()
const workingMinutes = ref(480)
const rows = ref([{ name: '', pieces: null, sam: null }, { name: '', pieces: null, sam: null }])
const result = ref(null)
const error = ref('')

function addRow() { rows.value.push({ name: '', pieces: null, sam: null }) }
function removeRow(i) { rows.value.splice(i, 1) }

function calculate() {
  error.value = ''; result.value = null
  if (!workingMinutes.value || workingMinutes.value <= 0) return (error.value = t('err.invalidMinutes'))
  const validRows = rows.value.filter(r => r.pieces > 0 && r.sam > 0)
  if (validRows.length === 0) return (error.value = t('err.noOperations'))
  const breakdown = validRows.map((r, i) => ({ name: r.name || `Op ${i + 1}`, pieces: r.pieces, sam: r.sam, earned: parseFloat((r.pieces * r.sam).toFixed(2)) }))
  const totalSAMEarned = breakdown.reduce((s, r) => s + r.earned, 0)
  result.value = { totalSAMEarned: parseFloat(totalSAMEarned.toFixed(2)), totalPieces: breakdown.reduce((s, r) => s + r.pieces, 0), efficiency: parseFloat(((totalSAMEarned / workingMinutes.value) * 100).toFixed(2)), breakdown }
}

function reset() {
  workingMinutes.value = 480
  rows.value = [{ name: '', pieces: null, sam: null }, { name: '', pieces: null, sam: null }]
  result.value = null; error.value = ''
}
</script>
