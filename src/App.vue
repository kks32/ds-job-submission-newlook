<template>
  <v-app>
    <!-- DesignSafe Header -->
    <v-app-bar app color="white" elevation="1" height="80">
      <v-container fluid class="d-flex align-center pa-0">
        <!-- Left side: NSF Logo and DesignSafe branding -->
        <div class="d-flex align-center">
          <img 
            src="/logo.png" 
            alt="NSF DesignSafe Logo" 
            class="logo-img"
          />
          <div class="branding-text ml-3">
            <div class="nsf-text">NSF NHERI</div>
            <div class="designsafe-text">
              <span class="design-text">DESIGN</span><span class="safe-text">SAFE</span>
            </div>
          </div>
        </div>

        <v-spacer></v-spacer>

        <!-- Right side: Social icons and user info -->
        <div class="d-flex align-center">
          <div class="social-icons mr-4">
            <v-btn icon size="small" class="social-btn">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon size="small" class="social-btn">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon size="small" class="social-btn">
              <v-icon>mdi-linkedin</v-icon>
            </v-btn>
            <v-btn icon size="small" class="social-btn">
              <v-icon>mdi-youtube</v-icon>
            </v-btn>
            <v-btn icon size="small" class="social-btn">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          
          <div class="user-section">
            <v-btn variant="outlined" size="small" class="mr-2">
              <v-icon left>mdi-briefcase</v-icon>
              0 Job Status
            </v-btn>
            <v-btn variant="outlined" size="small">
              Welcome, Krishna!
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Navigation Bar -->
    <v-app-bar app color="#666" dark height="50" style="top: 80px;">
      <v-container fluid class="pa-0">
        <div class="nav-items d-flex align-center">
          <v-btn variant="text" color="white" class="nav-btn">Use DesignSafe</v-btn>
          <v-btn variant="text" color="white" class="nav-btn">Learning Center</v-btn>
          <v-btn variant="text" color="white" class="nav-btn">NHERI Facilities</v-btn>
          <v-btn variant="text" color="white" class="nav-btn">NHERI Community</v-btn>
          <v-btn variant="text" color="white" class="nav-btn">News</v-btn>
          <v-btn variant="text" color="white" class="nav-btn">Help</v-btn>
          
          <v-spacer></v-spacer>
          
          <div class="search-section d-flex align-center">
            <v-text-field
              placeholder="Search DesignSafe"
              variant="outlined"
              density="compact"
              hide-details
              class="search-field mr-2"
            >
              <template v-slot:prepend-inner>
                <v-icon>mdi-magnify</v-icon>
              </template>
            </v-text-field>
            <v-btn-toggle mandatory class="toggle-buttons">
              <v-btn size="small" value="website">
                <v-icon left>mdi-web</v-icon>
                Website
              </v-btn>
              <v-btn size="small" value="datasets">
                <v-icon left>mdi-database</v-icon>
                Datasets
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </v-container>
    </v-app-bar>


    <!-- Warning Banner -->
    <v-banner color="warning" icon="mdi-alert" class="warning-banner" style="margin-top: 130px;">
      <template v-slot:text>
        <strong>TACC Maintenance Outage: June 17-19</strong> — The 
        <strong style="color: #d32f2f;">$WORK</strong> filesystem will be unavailable. Apps, Jobs & Jupyter Notebooks may be impacted during this time. To run jobs migrate 
        <span style="color: #d32f2f;">×</span> data to 
        <strong style="color: #d32f2f;">$SCRATCH</strong> and update job scripts. Account management will not work during this time. For updates, read further and subscribe to updates at 
        <a href="#" class="text-primary">TACC User News</a>.
      </template>
      <template v-slot:actions>
        <v-btn icon size="small">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-banner>

    <!-- Breadcrumb Navigation -->
    <v-container fluid class="breadcrumb-section">
      <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" :disabled="item.disabled">
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-container>

    <!-- Main Content -->
    <v-main class="main-content">
      <MPMForm />
    </v-main>
  </v-app>
</template>

<script setup>
import MPMForm from './components/MPMForm.vue'

const breadcrumbItems = [
  { text: 'Home', to: '/' },
  { text: 'Use DesignSafe', to: '/use' },
  { text: 'Tools & Applications', to: '/tools' },
  { text: 'Simulation', to: '/simulation' },
  { text: 'MPM Overview', to: '/mpm-overview' },
  { text: 'MPM', disabled: true }
]
</script>

<style scoped>
.logo-img {
  height: 60px;
  width: auto;
}


.social-icons {
  display: flex;
  gap: 4px;
}

.social-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #666;
}

.user-section {
  display: flex;
  align-items: center;
}

.nav-items {
  height: 100%;
}

.nav-btn {
  text-transform: none;
  height: 100%;
  border-radius: 0;
}

.search-field {
  width: 200px;
}

.search-field :deep(.v-field) {
  background: white;
}

.toggle-buttons {
  background: white;
  border-radius: 4px;
}


.breadcrumb-section {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 8px 16px;
}

.branding-text {
  display: flex;
  flex-direction: column;
}

.nsf-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  line-height: 1;
}

.designsafe-text {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
}

.design-text {
  color: #d32f2f;
}

.safe-text {
  color: #666;
}

.warning-banner {
  border-left: 4px solid #ff9800;
}

.main-content {
  background: #f5f5f5;
  min-height: calc(100vh - 260px);
}

/* Global app styles */
:deep(.v-application) {
  font-family: 'Roboto', sans-serif;
}
</style>