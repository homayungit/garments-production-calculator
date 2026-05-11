<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.dhu.icon') }} {{ t('calc.dhu.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.dhu.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.piecesChecked') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.checked" type="number" min="1" step="1" placeholder="e.g. 200" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.piecesCheckedHint') }}</p>
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.totalDefects') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.defects" type="number" min="0" step="1" placeholder="e.g. 18" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.defectivePieces') }}</label>
            <input v-model.number="form.defectivePieces" type="number" min="0" step="1" placeholder="e.g. 14" class="calc-input" />
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
          <div class="result-value"
            :class="result.dhu <= 2 ? 'text-primary-700 dark:text-primary-400' : result.dhu <= 5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'">
            {{ result.dhu }}
          </div>
          <div class="result-label">{{ t('res.dhu') }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div class="result-card">
            <div class="result-card-value">{{ result.defectsPerPiece }}</div>
            <div class="result-card-label">{{ t('res.defectsPerPiece') }}</div>
          </div>
          <div v-if="result.rejectionRate !== null" class="result-card">
            <div class="result-card-value">{{ result.rejectionRate }}%</div>
            <div class="result-card-label">{{ t('res.rejectionRate') }}</div>
          </div>
        </div>
        <div class="rounded-xl p-3 text-center text-xs font-semibold"
          :class="result.dhu <= 2
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800'
            : result.dhu <= 5
            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'">
          {{ result.dhu <= 2 ? t('dhuRating.excellent') : result.dhu <= 5 ? t('dhuRating.acceptable') : t('dhuRating.poor') }}
        </div>
        <div class="formula-box">
          DHU = (Total Defects / Total Inspected) × 100<br>
          Rejection Rate = (Defective Pieces / Total Inspected) × 100
        </div>
      </div>
      <div v-if="error" class="error-box mt-3">{{ error }}</div>
    </template>
  </CalcLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useLang } from '../../composables/useLang.js'
import CalcLayout from '../../components/CalcLayout.vue'

const { t } = useLang()
const form = reactive({ checked: null, defects: null, defectivePieces: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { checked, defects, defectivePieces } = form
  if (!checked || checked <= 0)       return (error.value = t('err.invalidChecked'))
  if (defects == null || defects < 0) return (error.value = t('err.invalidDefects'))
  result.value = {
    dhu:             parseFloat(((defects / checked) * 100).toFixed(2)),
    defectsPerPiece: parseFloat((defects / checked).toFixed(3)),
    rejectionRate:   defectivePieces > 0 ? parseFloat(((defectivePieces / checked) * 100).toFixed(2)) : null,
  }
}
function reset() {
  form.checked = null; form.defects = null; form.defectivePieces = null
  result.value = null; error.value = ''
}
</script>
