<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input :aria-placeholder="Class" style="width: 600px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" >Search</el-button>
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="data2"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="margin-bottom: 20px;">
      <!--<el-checkbox v-model="selectAll" >Option</el-checkbox>-->
      <el-table-column prop="testerName" align="center" label="Tester Username" />
      <el-table-column label="Student ID" prop="id" />
      <el-table-column label="Timestamp" prop="timestamp" align="center"/>
      <el-table-column label="Result (Pass/Fail)" prop="result" align="center"/>
      <el-table-column label="School Name" prop="schoolName" align="center"/>
      <el-table-column label="School District" prop="schoolDistrict" align="center"/>
      <el-table-column label="SessionStart" prop="sessionStart" align="center"/>
      <!--<el-table-column align="center" prop="created_at" label="Display_time" width="200">-->
      <!--<template slot-scope="scope">-->
      <!--<i class="el-icon-time"/>-->
      <!--<span>{{ scope.row.display_time }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <template>
          <el-button
            type="info"
            @click="goBack()"
          >Back</el-button>
    </template>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      total: 3,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      list: null,
      selectAll: false,
      data2: [{
        selected: false,
        testerName: 'TesterOne',
        id: '14',
        timestamp: '2019/01/31 10:14:30',
        result: 'pass',
        schoolName: 'UWB',
        schoolDistrict: 'KingCounty',
        sessionStart: '2019/01/31 10:14:30'
      },
      {
        selected: false,
        testerName: 'TesterTwo',
        id: '14',
        timestamp: '2019/01/31 10:14:30',
        result: 'fail',
        schoolName: 'UWB',
        schoolDistrict: 'KingCounty',
        sessionStart: '2019/01/30 10:14:30'
      },
      {
        selected: false,
        testerName: 'TesterThree',
        id: '14',
        timestamp: '2019/01/31 10:14:30',
        result: 'pass',
        schoolName: 'UWB',
        schoolDistrict: 'KingCounty',
        sessionStart: '2019/01/29 10:14:30'
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    goBack() {
      const { query } = this.$route
      // const { path } = params
      this.$router.replace({ path: '/' + 'studentInfo', query })
    }
  }
}

</script>
