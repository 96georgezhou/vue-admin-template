<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input :aria-placeholder="Class" style="width: 600px;" class="filter-item" />
      <el-select clearable style="width: 90px" class="filter-item">
        <el-option/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" >Search</el-button>
      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" >Add</el-button>-->
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" >Export</el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="data2"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <!--<el-checkbox v-model="selectAll" >Option</el-checkbox>-->
      <el-table-column prop="LoginName" align="center" width = "110" label="Login Name" />
      <el-table-column label="Email" width = "145" prop="Email" />
      <el-table-column label="First Name" prop="FirstName" align="center"/>
      <el-table-column label="Last Name" prop="LastName" align="center"/>
      <el-table-column label="Gender" prop="Gender" align="center"/>
      <el-table-column label="Date of Birth" prop="DOB" width = "110" align="center"/>
      <el-table-column label="Phone" prop="Phone" width = "120" align="center"/>
      <el-table-column label="Organization" prop="Organization" width = "110" align="center"/>
      <el-table-column label="Actions" align="center" width = "180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" size="mini" >Approve</el-button>
          <el-button size="mini" type="danger" >Reject</el-button>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" prop="created_at" label="Display_time" width="200">-->
      <!--<template slot-scope="scope">-->
      <!--<i class="el-icon-time"/>-->
      <!--<span>{{ scope.row.display_time }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <div style="position:absolute; bottom:0; width:100%; height:60px; margin-left:300px">
      <el-pagination
        :current-page.sync="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        :total="400"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/table'
// import { router } from '@/router/index'

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
        LoginName: 'john',
        Email: 'john.smith@uw.edu',
        FirstName: 'John',
        LastName: 'Smith',
        Gender: 'Male',
        DOB: '1989-04-01',
        Phone: '(000) 000-0000',
        Organization: 'UW Bothell',
        RoleID: 2
      },
      {
        selected: false,
        LoginName: 'john',
        Email: 'john.smith@uw.edu',
        FirstName: 'John',
        LastName: 'Smith',
        Gender: 'Male',
        DOB: '1989-04-01',
        Phone: '(000) 000-0000',
        Organization: 'UW Bothell',
        RoleID: 2
      },
      {
        selected: false,
        LoginName: 'john',
        Email: 'john.smith@uw.edu',
        FirstName: 'John',
        LastName: 'Smith',
        Gender: 'Male',
        DOB: '1989-04-01',
        Phone: '(000) 000-0000',
        Organization: 'UW Bothell',
        RoleID: 2
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
    navigate: function() {
      const { query } = this.$route
      // const { path } = params
      this.$router.replace({ path: '/' + 'detailedTable', query })
    }
  }
}

</script>
