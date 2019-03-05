<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" to="/example/table">
        <div class="card-panel-description">
          <div class="card-panel-text">
            <router-link to="/Report/index" tag="div">  Single Student </router-link>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" to="/example/table">
        <div class="card-panel-description">
          <div class="card-panel-text">
            <router-link to="/Report/index" tag="div">  Other Reports </router-link>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Menu',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    navigate() {
      this.router.push('/table')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col{
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-table {
          background: #40c9c6;
        }
        .icon-form {
          background: #36a3f7;
        }
        .icon-website {
          background: #f4516c;
        }
        .icon-shopping {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shopping {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 32px;
      }
      .card-panel-description {
        float: bottom;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 54px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 24px;
          margin-bottom: 6px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
