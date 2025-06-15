<template>
  <v-container fluid class="mpm-form">
    <!-- Header with DesignSafe branding -->
    <v-row>
      <v-col cols="12">
        <div class="header-section">
          <v-icon class="grid-icon">mdi-grid</v-icon>
          <span class="form-title">MPM</span>
          <v-spacer></v-spacer>
          <v-btn variant="text" color="primary" class="view-guide-btn">
            View User Guide
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
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

      <!-- Main Form Content -->
      <v-col cols="7" class="main-content">
        <v-stepper v-model="currentStep" class="elevation-0">
          <!-- Navigation Buttons at Top -->
          <div class="top-navigation">
            <v-btn 
              variant="outlined" 
              @click="prevStep"
              :disabled="currentStep === 1"
              class="nav-btn"
            >
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="nextStep"
              :disabled="currentStep === 4"
              class="nav-btn"
            >
              Continue
            </v-btn>
          </div>
          
          <v-stepper-header>
            <v-stepper-item 
              :complete="currentStep > 1" 
              :value="1"
              title="Inputs"
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item 
              :complete="currentStep > 2" 
              :value="2"
              title="Parameters"
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item 
              :complete="currentStep > 3" 
              :value="3"
              title="Configuration"
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item 
              :value="4"
              title="Outputs"
            ></v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <!-- Step 1: Inputs -->
            <v-stepper-window-item :value="1">
              <div class="step-content">
                <h3>Input Directory</h3>
                <div class="input-group">
                  <v-text-field
                    v-model="form.inputDirectory"
                    variant="outlined"
                    readonly
                    :placeholder="form.inputDirectory || 'Select directory'"
                    class="directory-input"
                  >
                    <template v-slot:prepend>
                      <v-btn 
                        variant="outlined" 
                        size="small" 
                        @click="selectDirectory"
                        class="select-btn"
                      >
                        Select
                      </v-btn>
                    </template>
                    <template v-slot:append>
                      <v-btn 
                        variant="text" 
                        size="small" 
                        color="primary"
                        @click="clearField('inputDirectory')"
                      >
                        Clear
                      </v-btn>
                    </template>
                  </v-text-field>
                  <p class="field-description">
                    The directory containing your MPM input files. Example input is in tapis://cloud.data/corral/tacc/aci/CEP/community/app_examples/mpm/uniaxial_stress
                  </p>
                </div>
              </div>
            </v-stepper-window-item>

            <!-- Step 2: Parameters -->
            <v-stepper-window-item :value="2">
              <div class="step-content">
                <h3>Input Script <span class="required-label">(appArgs)</span></h3>
                <div class="input-group">
                  <v-text-field
                    v-model="form.inputScript"
                    variant="outlined"
                    :rules="inputScriptRules"
                    placeholder="mpm.json"
                  >
                    <template v-slot:append>
                      <v-btn 
                        variant="text" 
                        size="small" 
                        color="primary"
                        @click="clearField('inputScript')"
                      >
                        Clear
                      </v-btn>
                    </template>
                  </v-text-field>
                  <p class="field-description">
                    Please provide the input file name. Example input file is mpm.json
                  </p>
                </div>
              </div>
            </v-stepper-window-item>

            <!-- Step 3: Configuration -->
            <v-stepper-window-item :value="3">
              <div class="step-content">
                <!-- Allocation -->
                <div class="input-group">
                  <h4>Allocation</h4>
                  <v-select
                    v-model="form.allocation"
                    :items="allocationOptions"
                    variant="outlined"
                    placeholder="Select allocation"
                  >
                    <template v-slot:append>
                      <v-btn 
                        variant="text" 
                        size="small" 
                        color="primary"
                        @click="clearField('allocation')"
                      >
                        Clear
                      </v-btn>
                    </template>
                  </v-select>
                  <p class="field-description">
                    Select the project allocation you would like to use with this job submission.
                  </p>
                </div>

                <!-- Queue -->
                <div class="input-group">
                  <h4>Queue</h4>
                  <v-select
                    v-model="form.queue"
                    :items="queueOptions"
                    variant="outlined"
                    placeholder="Select queue"
                  >
                    <template v-slot:append>
                      <v-btn 
                        variant="text" 
                        size="small" 
                        color="primary"
                        @click="clearField('queue')"
                      >
                        Clear
                      </v-btn>
                    </template>
                  </v-select>
                  <p class="field-description">
                    Select the queue this job will execute on.
                  </p>
                </div>

                <!-- Maximum Job Runtime -->
                <div class="input-group">
                  <h4>Maximum Job Runtime (minutes)</h4>
                  <v-text-field
                    v-model.number="form.maxRuntime"
                    type="number"
                    variant="outlined"
                    :rules="runtimeRules"
                  >
                    <template v-slot:append>
                      <v-btn 
                        variant="text" 
                        size="small" 
                        color="primary"
                        @click="clearField('maxRuntime')"
                      >
                        Clear
                      </v-btn>
                    </template>
                  </v-text-field>
                  <p class="field-description">
                    The maximum number of minutes you expect this job to run for. Maximum possible is 120 minutes. After this amount of time your job will end. Shorter run times result in shorter queue wait times.
                  </p>
                </div>

                <!-- Node Count -->
                <div class="input-group">
                  <h4>Node Count</h4>
                  <v-text-field
                    v-model.number="form.nodeCount"
                    type="number"
                    variant="outlined"
                    :rules="nodeCountRules"
                  >
                    <template v-slot:append>
                      <v-btn 
                        variant="text" 
                        size="small" 
                        color="primary"
                        @click="clearField('nodeCount')"
                      >
                        Clear
                      </v-btn>
                    </template>
                  </v-text-field>
                  <p class="field-description">
                    Number of requested process nodes for the job.
                  </p>
                </div>

                <!-- Cores Per Node -->
                <div class="input-group">
                  <h4>Cores Per Node</h4>
                  <v-text-field
                    v-model.number="form.coresPerNode"
                    type="number"
                    variant="outlined"
                    :rules="coresPerNodeRules"
                  >
                    <template v-slot:append>
                      <v-btn 
                        variant="text" 
                        size="small" 
                        color="primary"
                        @click="clearField('coresPerNode')"
                      >
                        Clear
                      </v-btn>
                    </template>
                  </v-text-field>
                  <p class="field-description">
                    Number of processors (cores) per node for the job. e.g. a selection of 16 processors per node along with 4 nodes would result in 64 total processors and jobs.
                  </p>
                </div>
              </div>
            </v-stepper-window-item>

            <!-- Step 4: Outputs -->
            <v-stepper-window-item :value="4">
              <div class="step-content">
                <!-- Job Name -->
                <div class="input-group">
                  <h4>Job Name</h4>
                  <v-text-field
                    v-model="form.jobName"
                    variant="outlined"
                    :rules="jobNameRules"
                  >
                    <template v-slot:append>
                      <v-btn 
                        variant="text" 
                        size="small" 
                        color="primary"
                        @click="clearField('jobName')"
                      >
                        Clear
                      </v-btn>
                    </template>
                  </v-text-field>
                  <p class="field-description">
                    A recognizable name for this job.
                  </p>
                </div>

                <!-- Archive System -->
                <div class="input-group">
                  <h4>Archive System</h4>
                  <v-text-field
                    v-model="form.archiveSystem"
                    variant="outlined"
                  >
                    <template v-slot:append>
                      <v-btn 
                        variant="text" 
                        size="small" 
                        color="primary"
                        @click="clearField('archiveSystem')"
                      >
                        Clear
                      </v-btn>
                    </template>
                  </v-text-field>
                  <p class="field-description">
                    System into which output files are archived after application execution.
                  </p>
                </div>

                <!-- Archive Directory -->
                <div class="input-group">
                  <h4>Archive Directory</h4>
                  <v-text-field
                    v-model="form.archiveDirectory"
                    variant="outlined"
                  >
                    <template v-slot:append>
                      <v-btn 
                        variant="text" 
                        size="small" 
                        color="primary"
                        @click="clearField('archiveDirectory')"
                      >
                        Clear
                      </v-btn>
                    </template>
                  </v-text-field>
                  <p class="field-description">
                    Directory into which output files are archived after application execution.
                  </p>
                </div>
              </div>
            </v-stepper-window-item>
          </v-stepper-window>

          <!-- Navigation Buttons at Bottom (duplicate for convenience) -->
          <div class="bottom-navigation">
            <v-btn 
              variant="outlined" 
              @click="prevStep"
              :disabled="currentStep === 1"
              class="nav-btn"
            >
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="nextStep"
              :disabled="currentStep === 4"
              class="nav-btn"
            >
              Continue
            </v-btn>
          </div>
        </v-stepper>
      </v-col>

      <!-- Right Summary Panel -->
      <v-col cols="3" class="summary-panel">
        <div class="summary-card">
          <div class="summary-header">
            <h3>Summary</h3>
            <v-btn 
              v-if="currentStep === 4"
              color="success" 
              size="large"
              @click="submitJob"
              :disabled="!isFormValid"
              class="submit-btn"
            >
              Submit Job
            </v-btn>
          </div>

          <!-- Inputs Summary -->
          <div class="summary-section" v-if="form.inputDirectory">
            <div class="section-header">
              <h4>Inputs</h4>
              <v-btn variant="text" size="small" color="primary">Edit</v-btn>
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
              <v-btn variant="text" size="small" color="primary">Edit</v-btn>
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
              <v-btn variant="text" size="small" color="primary">Edit</v-btn>
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
              <v-btn variant="text" size="small" color="primary">Edit</v-btn>
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
import { ref, computed } from 'vue'

// Form state management
const currentStep = ref(1)
const form = ref({
  inputDirectory: 'tapis://designsafe.storage.default/kks32/mpm-benchmarks/2d/uniaxial_stress',
  inputScript: 'mpm.json',
  allocation: 'ASC25049',
  queue: 'skx-dev',
  maxRuntime: 120,
  nodeCount: 1,
  coresPerNode: 48,
  jobName: 'mpm-s3-1.0_2025-06-15T10:36:49',
  archiveSystem: 'designsafe.storage.default',
  archiveDirectory: 'kks32/tapis-jobs-archive/${JobCreateDate}/${JobName}-${JobUUID}'
})

// Dropdown options
const allocationOptions = ['ASC25049', 'Other-Allocation']
const queueOptions = ['skx-dev', 'normal', 'development']

// Form validation rules
const inputScriptRules = [
  v => !!v || 'Input script is required',
  v => v.endsWith('.json') || 'Input script must be a .json file'
]

const runtimeRules = [
  v => !!v || 'Runtime is required',
  v => v > 0 || 'Runtime must be greater than 0',
  v => v <= 120 || 'Maximum runtime is 120 minutes'
]

const nodeCountRules = [
  v => !!v || 'Node count is required',
  v => v > 0 || 'Node count must be greater than 0'
]

const coresPerNodeRules = [
  v => !!v || 'Cores per node is required',
  v => v > 0 || 'Cores per node must be greater than 0'
]

const jobNameRules = [
  v => !!v || 'Job name is required'
]

// Computed properties
const hasConfigurationData = computed(() => {
  return form.value.allocation || form.value.queue || form.value.maxRuntime || 
         form.value.nodeCount || form.value.coresPerNode
})

const hasOutputsData = computed(() => {
  return form.value.jobName || form.value.archiveSystem || form.value.archiveDirectory
})

const isFormValid = computed(() => {
  return form.value.inputDirectory && 
         form.value.inputScript && 
         form.value.allocation && 
         form.value.queue && 
         form.value.maxRuntime && 
         form.value.nodeCount && 
         form.value.coresPerNode && 
         form.value.jobName
})

// Methods
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const clearField = (fieldName) => {
  if (typeof form.value[fieldName] === 'number') {
    form.value[fieldName] = null
  } else {
    form.value[fieldName] = ''
  }
}

const selectDirectory = () => {
  // Directory selection logic would go here
  console.log('Opening directory selector...')
}

const submitJob = () => {
  if (isFormValid.value) {
    console.log('Submitting job with data:', form.value)
    // Submit job logic would go here
  }
}
</script>

<style scoped>
.mpm-form {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header-section {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.grid-icon {
  margin-right: 8px;
  color: #666;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
}

.view-guide-btn {
  text-transform: none;
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

.main-content {
  background: white;
  padding: 2rem;
}

.step-content {
  padding: 2rem 0;
}

.step-content h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.step-content h4 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.input-group {
  margin-bottom: 2rem;
}

.required-label {
  color: #1976d2;
  font-size: 0.9rem;
}

.field-description {
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-style: italic;
}

.directory-input .v-field__prepend-inner {
  padding-right: 12px;
}

.select-btn {
  margin-right: 8px;
}

.summary-panel {
  padding: 1rem;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

.submit-btn {
  width: 100%;
  height: 48px;
  font-weight: 600;
  text-transform: none;
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

/* Vuetify component customizations */
.v-stepper {
  box-shadow: none !important;
}

.v-stepper-header {
  box-shadow: none !important;
  border-bottom: 1px solid #e0e0e0;
}

.v-text-field {
  margin-bottom: 0.5rem;
}

.top-navigation {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1rem;
}

.bottom-navigation {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid #e0e0e0;
  margin-top: 1rem;
}

.nav-btn {
  text-transform: none;
  font-weight: 500;
}

.v-btn {
  text-transform: none;
}
</style>