<template>
  <v-container fluid class="mpm-form">
    <!-- Main Content Row -->
    <v-row class="main-row">
      <!-- Left Sidebar Navigation -->
      <v-col cols="2" class="sidebar">
        <div class="nav-section">
          <v-icon color="orange">mdi-bell</v-icon>
          <span class="nav-title">Job Status</span>
        </div>
        
        <div class="applications-section">
          <h4>Applications:</h4>
          <div class="app-category">
            <v-icon>mdi-chevron-down</v-icon>
            <span>Simulation [24]</span>
          </div>
          <div class="app-item selected">MPM</div>
        </div>
      </v-col>

      <!-- Main Form Content with Sticky Header -->
      <v-col cols="7" class="form-content">
        <!-- Sticky Form Header -->
        <div class="form-header-sticky">
          <!-- Form Title and Controls -->
          <v-card class="form-controls-bar" elevation="1">
            <v-container fluid class="py-2">
              <v-row align="center" no-gutters>
                <v-col class="text-center">
                  <div class="form-header">
                    <v-icon class="form-icon">mdi-grid</v-icon>
                    <span class="form-title">MPM Job Configuration</span>
                  </div>
                </v-col>
                
                <v-col cols="auto" class="d-flex align-center">
                  <v-btn-toggle 
                    v-model="viewMode" 
                    mandatory 
                    variant="outlined"
                    density="compact"
                    class="mr-6"
                  >
                    <v-btn value="guided" size="small">
                      <v-icon left>mdi-form-select</v-icon>
                      Guided
                    </v-btn>
                    <v-btn value="json" size="small">
                      <v-icon left>mdi-code-json</v-icon>
                      JSON
                    </v-btn>
                  </v-btn-toggle>
                  
                  <v-btn 
                    v-if="isFormValid"
                    color="success" 
                    @click="submitJob"
                    class="submit-btn"
                    size="large"
                  >
                    <v-icon left>mdi-rocket-launch</v-icon>
                    Submit Job
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <!-- Progress Bar -->
          <v-card class="progress-bar-card" elevation="0">
            <v-container fluid>
              <div class="progress-steps">
                <div 
                  v-for="(step, index) in steps"
                  :key="step.id"
                  class="progress-step"
                  :class="{ 
                    'active': activeSection === step.id,
                    'completed': step.completed.value,
                    'clickable': viewMode === 'guided'
                  }"
                  @click="viewMode === 'guided' && scrollToSection(step.id)"
                >
                  <div class="step-indicator">
                    <v-icon 
                      :color="step.completed.value ? 'white' : (activeSection === step.id ? 'primary' : 'grey')"
                      size="small"
                    >
                      {{ step.completed.value ? 'mdi-check' : step.icon }}
                    </v-icon>
                    <!-- Required indicator for incomplete required steps -->
                    <div 
                      v-if="!step.completed.value && step.required"
                      class="required-indicator"
                    >
                      !
                    </div>
                    <!-- Checkmark for completed steps -->
                    <div 
                      v-if="step.completed.value"
                      class="completed-indicator"
                    >
                      ✓
                    </div>
                  </div>
                  <div class="step-content">
                    <div class="step-title">{{ step.title }}</div>
                    <div class="step-subtitle">{{ step.subtitle }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Progress Line -->
              <div class="progress-line">
                <div 
                  class="progress-fill"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
            </v-container>
          </v-card>
        </div>

        <!-- Scrollable Form Content -->
        <div class="scrollable-content">
          <!-- Guided Mode -->
          <div v-if="viewMode === 'guided'" class="form-sections">
            <!-- Input Directory Section -->
            <v-card 
              :id="'section-inputs'"
              class="form-section"
              :class="{ 'section-completed': !!form.inputDirectory }"
              elevation="1"
            >
              <v-card-title class="section-header">
                <v-icon 
                  :color="!!form.inputDirectory ? 'success' : 'primary'"
                  class="section-icon"
                >
                  {{ !!form.inputDirectory ? 'mdi-check-circle' : 'mdi-folder' }}
                </v-icon>
                <div class="section-title-content">
                  <h3>Input Directory</h3>
                  <p class="section-subtitle">Select the directory containing your MPM input files</p>
                </div>
                <v-chip 
                  :color="!!form.inputDirectory ? 'success' : 'error'" 
                  variant="tonal" 
                  size="small"
                >
                  {{ !!form.inputDirectory ? 'Complete' : 'Required' }}
                </v-chip>
              </v-card-title>
              
              <v-card-text>
                <v-text-field
                  v-model="form.inputDirectory"
                  variant="outlined"
                  placeholder="Select input directory..."
                  readonly
                  class="modern-input"
                >
                  <template v-slot:prepend-inner>
                    <v-btn 
                      variant="tonal" 
                      size="small" 
                      @click="selectDirectory"
                      class="select-btn"
                    >
                      Browse
                    </v-btn>
                  </template>
                  <template v-slot:append-inner>
                    <v-btn 
                      v-if="form.inputDirectory"
                      icon="mdi-close" 
                      variant="text" 
                      size="small"
                      @click="clearField('inputDirectory')"
                    ></v-btn>
                  </template>
                </v-text-field>
                
                <div class="help-text">
                  Example: tapis://cloud.data/corral/tacc/aci/CEP/community/app_examples/mpm/uniaxial_stress
                </div>
              </v-card-text>
            </v-card>

            <!-- Input Script Section -->
            <v-card 
              :id="'section-parameters'"
              class="form-section"
              :class="{ 'section-completed': !!form.inputScript }"
              elevation="1"
            >
              <v-card-title class="section-header">
                <v-icon 
                  :color="!!form.inputScript ? 'success' : 'primary'"
                  class="section-icon"
                >
                  {{ !!form.inputScript ? 'mdi-check-circle' : 'mdi-file-code' }}
                </v-icon>
                <div class="section-title-content">
                  <h3>Input Script <span class="required-label">(appArgs)</span></h3>
                  <p class="section-subtitle">Specify the input file name for your MPM simulation</p>
                </div>
                <v-chip 
                  :color="!!form.inputScript ? 'success' : 'error'" 
                  variant="tonal" 
                  size="small"
                >
                  {{ !!form.inputScript ? 'Complete' : 'Required' }}
                </v-chip>
              </v-card-title>
              
              <v-card-text>
                <v-text-field
                  v-model="form.inputScript"
                  variant="outlined"
                  :rules="inputScriptRules"
                  placeholder="e.g., mpm.json"
                  class="modern-input"
                >
                  <template v-slot:append-inner>
                    <v-btn 
                      v-if="form.inputScript"
                      icon="mdi-close" 
                      variant="text" 
                      size="small"
                      @click="clearField('inputScript')"
                    ></v-btn>
                  </template>
                </v-text-field>
                
                <div class="help-text">
                  Please provide the input file name. Example input file is mpm.json
                </div>
              </v-card-text>
            </v-card>

            <!-- Job Configuration Section -->
            <v-card 
              :id="'section-configuration'"
              class="form-section"
              :class="{ 'section-completed': hasConfigurationData }"
              elevation="1"
            >
              <v-card-title class="section-header">
                <v-icon 
                  :color="hasConfigurationData ? 'success' : 'grey'"
                  class="section-icon"
                >
                  {{ hasConfigurationData ? 'mdi-check-circle' : 'mdi-cog' }}
                </v-icon>
                <div class="section-title-content">
                  <h3>Job Configuration</h3>
                  <p class="section-subtitle">Configure computational resources for your job</p>
                </div>
                <v-chip 
                  :color="hasConfigurationData ? 'success' : 'grey'" 
                  variant="flat" 
                  size="small"
                >
                  {{ hasConfigurationData ? 'Complete' : 'Optional' }}
                </v-chip>
              </v-card-title>
              
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form.allocation"
                      :items="allocationOptions"
                      variant="outlined"
                      label="Allocation"
                      placeholder="Select allocation..."
                      class="modern-input"
                    >
                      <template v-slot:append-inner>
                        <v-btn 
                          v-if="form.allocation"
                          icon="mdi-close" 
                          variant="text" 
                          size="small"
                          @click="clearField('allocation')"
                        ></v-btn>
                      </template>
                    </v-select>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form.queue"
                      :items="queueOptions"
                      variant="outlined"
                      label="Queue"
                      placeholder="Select queue..."
                      class="modern-input"
                    >
                      <template v-slot:append-inner>
                        <v-btn 
                          v-if="form.queue"
                          icon="mdi-close" 
                          variant="text" 
                          size="small"
                          @click="clearField('queue')"
                        ></v-btn>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="form.maxRuntime"
                      type="number"
                      variant="outlined"
                      label="Max Runtime (minutes)"
                      :rules="runtimeRules"
                      placeholder="120"
                      class="modern-input"
                    >
                      <template v-slot:append-inner>
                        <v-btn 
                          v-if="form.maxRuntime"
                          icon="mdi-close" 
                          variant="text" 
                          size="small"
                          @click="clearField('maxRuntime')"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="form.nodeCount"
                      type="number"
                      variant="outlined"
                      label="Node Count"
                      :rules="nodeCountRules"
                      placeholder="1"
                      class="modern-input"
                    >
                      <template v-slot:append-inner>
                        <v-btn 
                          v-if="form.nodeCount"
                          icon="mdi-close" 
                          variant="text" 
                          size="small"
                          @click="clearField('nodeCount')"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="form.coresPerNode"
                      type="number"
                      variant="outlined"
                      label="Cores Per Node"
                      :rules="coresPerNodeRules"
                      placeholder="48"
                      class="modern-input"
                    >
                      <template v-slot:append-inner>
                        <v-btn 
                          v-if="form.coresPerNode"
                          icon="mdi-close" 
                          variant="text" 
                          size="small"
                          @click="clearField('coresPerNode')"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                
                <div class="help-text">
                  The maximum number of minutes you expect this job to run for. Maximum possible is 120 minutes. Shorter run times result in shorter queue wait times.
                </div>
              </v-card-text>
            </v-card>

            <!-- Output Configuration Section -->
            <v-card 
              :id="'section-outputs'"
              class="form-section"
              :class="{ 'section-completed': hasOutputsData }"
              elevation="1"
            >
              <v-card-title class="section-header">
                <v-icon 
                  :color="hasOutputsData ? 'success' : 'grey'"
                  class="section-icon"
                >
                  {{ hasOutputsData ? 'mdi-check-circle' : 'mdi-archive' }}
                </v-icon>
                <div class="section-title-content">
                  <h3>Output Configuration</h3>
                  <p class="section-subtitle">Configure how your job results will be stored</p>
                </div>
                <v-chip 
                  :color="hasOutputsData ? 'success' : 'grey'" 
                  variant="flat" 
                  size="small"
                >
                  {{ hasOutputsData ? 'Complete' : 'Optional' }}
                </v-chip>
              </v-card-title>
              
              <v-card-text>
                <v-text-field
                  v-model="form.jobName"
                  variant="outlined"
                  label="Job Name"
                  :rules="jobNameRules"
                  placeholder="Enter a recognizable name..."
                  class="modern-input mb-4"
                >
                  <template v-slot:append-inner>
                    <v-btn 
                      v-if="form.jobName"
                      icon="mdi-close" 
                      variant="text" 
                      size="small"
                      @click="clearField('jobName')"
                    ></v-btn>
                  </template>
                </v-text-field>
                
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.archiveSystem"
                      variant="outlined"
                      label="Archive System"
                      placeholder="designsafe.storage.default"
                      class="modern-input"
                    >
                      <template v-slot:append-inner>
                        <v-btn 
                          v-if="form.archiveSystem"
                          icon="mdi-close" 
                          variant="text" 
                          size="small"
                          @click="clearField('archiveSystem')"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.archiveDirectory"
                      variant="outlined"
                      label="Archive Directory"
                      placeholder="Path for archived files..."
                      class="modern-input"
                    >
                      <template v-slot:append-inner>
                        <v-btn 
                          v-if="form.archiveDirectory"
                          icon="mdi-close" 
                          variant="text" 
                          size="small"
                          @click="clearField('archiveDirectory')"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                
                <div class="help-text">
                  A recognizable name for this job. System and directory settings for archived output files.
                </div>
              </v-card-text>
            </v-card>
          </div>

          <!-- JSON Editor Mode -->
          <div v-else class="json-editor-mode">
            <v-card elevation="1" class="json-editor-card">
              <v-card-title class="json-editor-header">
                <v-icon left>mdi-code-json</v-icon>
                JSON Configuration Editor
                <v-spacer></v-spacer>
                <v-btn 
                  icon="mdi-refresh" 
                  variant="text" 
                  size="small"
                  @click="generateJsonFromForm"
                  :disabled="!hasAnyData"
                  v-tooltip="'Regenerate from form'"
                ></v-btn>
              </v-card-title>
              
              <v-card-text>
                <div class="json-actions mb-4">
                  <v-btn 
                    variant="outlined" 
                    color="primary"
                    @click="applyJsonToForm"
                    :disabled="!isValidJson"
                    class="mr-2"
                  >
                    <v-icon left>mdi-import</v-icon>
                    Apply to Form
                  </v-btn>
                  
                  <v-btn 
                    variant="outlined" 
                    @click="resetJson"
                  >
                    <v-icon left>mdi-undo</v-icon>
                    Reset
                  </v-btn>
                  
                  <v-btn 
                    variant="outlined" 
                    @click="formatJson"
                    :disabled="!isValidJson"
                    class="ml-2"
                  >
                    <v-icon left>mdi-code-braces</v-icon>
                    Format
                  </v-btn>
                </div>
                
                <v-textarea
                  v-model="jsonConfig"
                  variant="outlined"
                  label="Job Configuration (JSON)"
                  :rows="25"
                  :rules="jsonRules"
                  class="json-textarea"
                  placeholder="Edit your job configuration in JSON format..."
                  spellcheck="false"
                  @input="onJsonEdit"
                ></v-textarea>
                
                <v-alert 
                  v-if="jsonError"
                  type="error" 
                  variant="tonal"
                  class="mt-3"
                >
                  {{ jsonError }}
                </v-alert>
                
                <div class="help-text mt-3">
                  <strong>Advanced Mode:</strong> Edit the job configuration directly in JSON format. 
                  Changes will automatically sync with the guided form when you click "Apply to Form".
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-col>

      <!-- Right Summary Panel -->
      <v-col cols="3" class="summary-panel">
        <div class="summary-card">
          <div class="summary-header">
            <h3>Summary</h3>
            <v-btn 
              variant="outlined" 
              size="small"
              @click="generateJsonFromForm"
              :disabled="!hasAnyData"
            >
              <v-icon left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
          </div>

          <!-- Inputs Summary -->
          <div class="summary-section" v-if="form.inputDirectory">
            <div class="section-header">
              <h4>Inputs</h4>
              <v-btn 
                variant="text" 
                size="small" 
                color="primary"
                @click="editSection('inputs')"
              >
                Edit
              </v-btn>
            </div>
            <div class="summary-item">
              <span class="label">Input Directory</span>
              <span class="value">{{ form.inputDirectory }}</span>
            </div>
          </div>

          <!-- Parameters Summary -->
          <div class="summary-section" v-if="form.inputScript">
            <div class="section-header">
              <h4>Parameters</h4>
              <v-btn 
                variant="text" 
                size="small" 
                color="primary"
                @click="editSection('parameters')"
              >
                Edit
              </v-btn>
            </div>
            <div class="summary-item">
              <span class="label">Input Script</span>
              <span class="value">{{ form.inputScript }}</span>
            </div>
          </div>

          <!-- Configuration Summary -->
          <div class="summary-section" v-if="hasConfigurationData">
            <div class="section-header">
              <h4>Configuration</h4>
              <v-btn 
                variant="text" 
                size="small" 
                color="primary"
                @click="editSection('configuration')"
              >
                Edit
              </v-btn>
            </div>
            <div class="summary-item" v-if="form.allocation">
              <span class="label">Allocation</span>
              <span class="value">{{ form.allocation }}</span>
            </div>
            <div class="summary-item" v-if="form.queue">
              <span class="label">Queue</span>
              <span class="value">{{ form.queue }}</span>
            </div>
            <div class="summary-item" v-if="form.maxRuntime">
              <span class="label">Maximum Job Runtime (minutes)</span>
              <span class="value">{{ form.maxRuntime }}</span>
            </div>
            <div class="summary-item" v-if="form.nodeCount">
              <span class="label">Node Count</span>
              <span class="value">{{ form.nodeCount }}</span>
            </div>
            <div class="summary-item" v-if="form.coresPerNode">
              <span class="label">Cores Per Node</span>
              <span class="value">{{ form.coresPerNode }}</span>
            </div>
          </div>

          <!-- Outputs Summary -->
          <div class="summary-section" v-if="hasOutputsData">
            <div class="section-header">
              <h4>Outputs</h4>
              <v-btn 
                variant="text" 
                size="small" 
                color="primary"
                @click="editSection('outputs')"
              >
                Edit
              </v-btn>
            </div>
            <div class="summary-item" v-if="form.jobName">
              <span class="label">Job Name</span>
              <span class="value">{{ form.jobName }}</span>
            </div>
            <div class="summary-item" v-if="form.archiveSystem">
              <span class="label">Archive System</span>
              <span class="value">{{ form.archiveSystem }}</span>
            </div>
            <div class="summary-item" v-if="form.archiveDirectory">
              <span class="label">Archive Directory</span>
              <span class="value">{{ form.archiveDirectory }}</span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Form state
const form = ref({
  inputDirectory: 'tapis://designsafe.storage.default/kks32/mpm-benchmarks/2d/uniaxial_stress',
  inputScript: '',
  allocation: '',
  queue: 'skx-dev',
  maxRuntime: 120,
  nodeCount: 1,
  coresPerNode: 48,
  jobName: 'mpm-s3-1.0_2025-06-15T10:36:49',
  archiveSystem: 'designsafe.storage.default',
  archiveDirectory: 'kks32/tapis-jobs-archive/${JobCreateDate}/${JobName}-${JobUUID}'
})

const activeSection = ref('inputs')
const viewMode = ref('guided')
const jsonConfig = ref('')
const jsonError = ref('')

// Step definitions for progress bar
const steps = ref([
  {
    id: 'inputs',
    title: 'Input Directory',
    subtitle: 'Select input files',
    icon: 'mdi-folder',
    required: true,
    completed: computed(() => !!form.value.inputDirectory)
  },
  {
    id: 'parameters',
    title: 'Input Script',
    subtitle: 'Specify simulation file',
    icon: 'mdi-file-code',
    required: true,
    completed: computed(() => !!form.value.inputScript)
  },
  {
    id: 'configuration',
    title: 'Job Configuration',
    subtitle: 'Set resources',
    icon: 'mdi-cog',
    required: false,
    completed: computed(() => hasConfigurationData.value)
  },
  {
    id: 'outputs',
    title: 'Output Settings',
    subtitle: 'Name and storage',
    icon: 'mdi-archive',
    required: false,
    completed: computed(() => hasOutputsData.value)
  }
])

// Dropdown options
const allocationOptions = ['ASC25049', 'Other-Allocation']
const queueOptions = ['skx-dev', 'normal', 'development']

// Validation rules
const inputScriptRules = [
  v => !!v || 'Input script is required',
  v => v.endsWith('.json') || 'Input script must be a .json file'
]

const runtimeRules = [
  v => !v || v > 0 || 'Runtime must be greater than 0',
  v => !v || v <= 120 || 'Maximum runtime is 120 minutes'
]

const nodeCountRules = [
  v => !v || v > 0 || 'Node count must be greater than 0'
]

const coresPerNodeRules = [
  v => !v || v > 0 || 'Cores per node must be greater than 0'
]

const jobNameRules = [
  v => !v || v.length > 0 || 'Job name cannot be empty'
]

const jsonRules = [
  v => !v || isValidJsonString(v) || 'Invalid JSON format'
]

// Computed properties
const hasConfigurationData = computed(() => {
  return form.value.allocation || form.value.queue || form.value.maxRuntime || 
         form.value.nodeCount || form.value.coresPerNode
})

const hasOutputsData = computed(() => {
  return form.value.jobName || form.value.archiveSystem || form.value.archiveDirectory
})

const hasAnyData = computed(() => {
  return form.value.inputDirectory || form.value.inputScript || hasConfigurationData.value || hasOutputsData.value
})

const isFormValid = computed(() => {
  return form.value.inputDirectory && form.value.inputScript
})

const isValidJson = computed(() => {
  return jsonConfig.value && isValidJsonString(jsonConfig.value)
})

const progressPercentage = computed(() => {
  const completedSteps = steps.value.filter(step => step.completed.value).length
  return (completedSteps / steps.value.length) * 100
})

// Methods
const clearField = (fieldName) => {
  if (typeof form.value[fieldName] === 'number') {
    form.value[fieldName] = null
  } else {
    form.value[fieldName] = ''
  }
}

const selectDirectory = () => {
  console.log('Opening directory selector...')
}

const goBack = () => {
  console.log('Going back...')
}

const submitJob = () => {
  if (isFormValid.value) {
    console.log('Submitting job with data:', form.value)
  }
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(`section-${sectionId}`)
  if (element) {
    const container = document.querySelector('.scrollable-content')
    if (container) {
      // Get the sticky header height
      const stickyHeader = document.querySelector('.form-header-sticky')
      const headerHeight = stickyHeader ? stickyHeader.offsetHeight : 0
      
      // Calculate element position relative to the scrollable container
      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const currentScroll = container.scrollTop
      
      // Calculate target scroll position
      const targetScroll = currentScroll + (elementRect.top - containerRect.top) - 20
      
      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      })
      
      activeSection.value = sectionId
    }
  }
}

const editSection = (sectionId) => {
  if (viewMode.value === 'json') {
    viewMode.value = 'guided'
  }
  setTimeout(() => {
    scrollToSection(sectionId)
  }, 100)
}

const generateJsonFromForm = () => {
  const jobConfig = {
    inputDirectory: form.value.inputDirectory || null,
    inputScript: form.value.inputScript || null,
    allocation: form.value.allocation || null,
    queue: form.value.queue || null,
    maxRuntime: form.value.maxRuntime || null,
    nodeCount: form.value.nodeCount || null,
    coresPerNode: form.value.coresPerNode || null,
    jobName: form.value.jobName || null,
    archiveSystem: form.value.archiveSystem || null,
    archiveDirectory: form.value.archiveDirectory || null
  }
  
  jsonConfig.value = JSON.stringify(jobConfig, null, 2)
  jsonError.value = ''
}

const applyJsonToForm = () => {
  if (isValidJson.value) {
    try {
      const config = JSON.parse(jsonConfig.value)
      Object.keys(config).forEach(key => {
        if (form.value.hasOwnProperty(key)) {
          form.value[key] = config[key]
        }
      })
      jsonError.value = ''
    } catch (error) {
      jsonError.value = 'Error parsing JSON: ' + error.message
    }
  }
}

const resetJson = () => {
  const defaultConfig = {
    inputDirectory: null,
    inputScript: null,
    allocation: null,
    queue: null,
    maxRuntime: null,
    nodeCount: null,
    coresPerNode: null,
    jobName: null,
    archiveSystem: null,
    archiveDirectory: null
  }
  
  jsonConfig.value = JSON.stringify(defaultConfig, null, 2)
  jsonError.value = ''
}

const formatJson = () => {
  if (isValidJson.value) {
    try {
      const parsed = JSON.parse(jsonConfig.value)
      jsonConfig.value = JSON.stringify(parsed, null, 2)
      jsonError.value = ''
    } catch (error) {
      jsonError.value = 'Error formatting JSON: ' + error.message
    }
  }
}

const onJsonEdit = () => {
  if (jsonConfig.value && !isValidJsonString(jsonConfig.value)) {
    jsonError.value = 'Invalid JSON syntax'
  } else {
    jsonError.value = ''
  }
}

const isValidJsonString = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (error) {
    return false
  }
}

// Scroll spy to update active section
const handleScroll = () => {
  if (viewMode.value !== 'guided') return
  
  const container = document.querySelector('.scrollable-content')
  if (!container) return
  
  const sections = ['inputs', 'parameters', 'configuration', 'outputs']
  let currentSection = 'inputs'
  
  for (const sectionId of sections) {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      const rect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      
      if (rect.top - containerRect.top <= 200) {
        currentSection = sectionId
      }
    }
  }
  
  activeSection.value = currentSection
}

// Watch for form changes and auto-update JSON
watch(form, () => {
  if (hasAnyData.value && viewMode.value === 'json' && !jsonConfig.value) {
    generateJsonFromForm()
  }
}, { deep: true })

// Initialize JSON when switching to JSON mode
watch(viewMode, (newMode) => {
  if (newMode === 'json' && hasAnyData.value) {
    generateJsonFromForm()
  }
})

onMounted(() => {
  const container = document.querySelector('.scrollable-content')
  if (container) {
    container.addEventListener('scroll', handleScroll)
  }
  generateJsonFromForm() // Initialize JSON
})

onUnmounted(() => {
  const container = document.querySelector('.scrollable-content')
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.mpm-form {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 0;
}

.main-row {
  margin: 0;
  min-height: 100vh;
}

.sidebar {
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 1rem;
}

.nav-section {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.nav-title {
  margin-left: 8px;
  font-weight: 500;
}

.applications-section h4 {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.app-category {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #333;
}

.app-item {
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  border-radius: 4px;
}

.app-item.selected {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}

.form-content {
  background: #f5f5f5;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Sticky Form Header */
.form-header-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f5f5f5;
}

.form-controls-bar {
  background: white;
  border-radius: 0;
  margin-bottom: 0;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-icon {
  margin-right: 12px;
  color: #1976d2;
}

.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

.submit-btn {
  text-transform: none;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

/* Progress Bar Styles */
.progress-bar-card {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 0;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 1rem 0;
}

.progress-step {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 1rem;
  transition: all 0.3s ease;
}

.progress-step.clickable {
  cursor: pointer;
}

.progress-step.clickable:hover {
  background: #f8f9fa;
  border-radius: 8px;
}

.step-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  margin-right: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
}

.progress-step.active .step-indicator {
  background: #e3f2fd;
  border-color: #1976d2;
}

.progress-step.completed .step-indicator {
  background: #4caf50;
  border-color: #4caf50;
}

.progress-step:not(.completed) .step-indicator {
  background: #f5f5f5;
  border-color: #e0e0e0;
}

.progress-step:not(.completed).active .step-indicator {
  background: #e3f2fd;
  border-color: #1976d2;
}

.required-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  background: #f44336;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.completed-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}

.step-subtitle {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.progress-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #e0e0e0;
  transform: translateY(-50%);
  z-index: -1;
}

.progress-fill {
  height: 100%;
  background: #4caf50;
  transition: width 0.5s ease;
}

/* Scrollable Content */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.form-sections {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 2rem;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.form-section.section-completed {
  border-color: #e8f5e8;
  background: #fefffe;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  padding: 1.5rem !important;
  background: rgba(0,0,0,0.02);
}

.section-icon {
  margin-right: 1rem;
  font-size: 1.5rem;
}

.section-title-content {
  flex: 1;
}

.section-title-content h3 {
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.section-subtitle {
  color: #666;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.required-label {
  color: #1976d2;
  font-size: 0.9rem;
}

.modern-input {
  margin-bottom: 1rem;
}

.modern-input :deep(.v-field) {
  border-radius: 8px;
}

.select-btn {
  margin-right: 12px;
  text-transform: none;
  font-weight: 500;
}

.help-text {
  color: #666;
  font-size: 0.875rem;
  font-style: italic;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #e0e0e0;
}

/* JSON Editor Styles */
.json-editor-mode {
  max-width: 800px;
  margin: 0 auto;
}

.json-editor-card {
  border-radius: 12px;
}

.json-editor-header {
  background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
  color: #1976d2;
  font-weight: 600;
}

.json-textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
}

.json-textarea :deep(.v-field) {
  border-radius: 8px;
  background: #fafafa;
}

.json-actions {
  display: flex;
  gap: 8px;
}

.summary-panel {
  padding: 1rem;
  height: 100vh;
  overflow-y: auto;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: 100%;
  overflow-y: auto;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.summary-header h3 {
  color: #333;
  font-size: 1.25rem;
  margin: 0;
}

.summary-section {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;
}

.summary-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0 !important;
  background: none !important;
}

.section-header h4 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.summary-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-item .label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.summary-item .value {
  font-size: 0.875rem;
  color: #333;
  font-weight: 500;
  word-break: break-all;
}

.v-btn {
  text-transform: none;
}

/* Responsive design */
@media (max-width: 1200px) {
  .sidebar {
    display: none;
  }
  
  .form-content {
    width: 75% !important;
  }
}

@media (max-width: 768px) {
  .progress-steps {
    flex-direction: column;
  }
  
  .progress-step {
    margin-bottom: 1rem;
  }
  
  .step-title {
    font-size: 0.875rem;
  }
  
  .step-subtitle {
    font-size: 0.75rem;
  }
}
</style>