<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input v-model="search" placeholder="Type to search" style="width: 600px;"/>
      <!-- <el-input :aria-placeholder="Class" style="width: 600px;" class="filter-item"/> -->
      <!-- <el-select clearable style="width: 90px" class="filter-item">
        <el-option/>
      </el-select>-->
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">Search</el-button> -->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
      >Add</el-button>
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
      >Export</el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="studentData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      :default-sort="{prop: 'name', order: 'ascending'}"
      :row-class-name="tableRowClassName"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!--<el-checkbox v-model="selectAll" >Option</el-checkbox>-->
      <el-table-column sortable prop="id" align="center" label="Student ID"/>
      <el-table-column sortable label="Name" prop="name"/>
      <el-table-column sortable label="Grade" prop="grade" align="center"/>
      <el-table-column sortable label="School Name" prop="schoolName" align="center"/>
      <el-table-column
        sortable
        label="School District"
        prop="schoolDistrict"
        width="150"
        align="center"
      />
      <el-table-column
        label="Tests"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="warning"
            size="mini"
            @click="handleResults(scope.$index, scope.row)"
          >Results</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          <el-button type="info" size="mini" @click="handleRefer(scope.$index, scope.row)">Refer</el-button>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" prop="created_at" label="Display_time" width="200">-->
      <!--<template slot-scope="scope">-->
      <!--<i class="el-icon-time"/>-->
      <!--<span>{{ scope.row.display_time }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <!-- <div style="position:absolute; bottom:0; width:100%; height:60px; margin-left:300px">
      <el-pagination
        :current-page.sync="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        :total="400"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>-->
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
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      list: null,
      selectAll: false,
      search: '',
      // studentData: [],
      studentData: [
        {
          id: 1,
          name: 'George',
          schoolName: 'UWB',
          schoolDistrict: 'King County',
          grade: '1'
        },
        {
          id: 2,
          name: 'Sarah',
          schoolName: 'UWB',
          schoolDistrict: 'King County',
          grade: '2'
        },
        {
          id: 3,
          name: 'Donald',
          schoolName: 'UWB',
          schoolDistrict: 'King County',
          grade: '3'
        }
      ]
      // data2: [
      //   {
      //     selected: false,
      //     id: 1,
      //     name: "George",
      //     schoolName: "UWB",
      //     schoolDistrict: "KingCounty",
      //     grade: "gradeOne",
      //     refer: "Result",
      //     test: [1, 2, 3]
      //   },
      //   {
      //     selected: false,
      //     id: 2,
      //     name: "Sarah",
      //     schoolName: "UWB",
      //     schoolDistrict: "KingCounty",
      //     grade: "gradeTwo",
      //     refer: "Result",
      //     test: [1, 2, 3]
      //   },
      //   {
      //     selected: false,
      //     id: 3,
      //     name: "Donald",
      //     schoolName: "UWB",
      //     schoolDistrict: "KingCounty",
      //     grade: "gradeThree",
      //     refer: "Result",
      //     test: [1, 2, 3]
      //   }
      // ]
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
    handleResults(index, row) {
      const { query } = this.$route
      // const { path } = params
      this.$router.replace({ path: '/' + 'detailedTable', query })
    },
    tableRowClassName({ row, rowIndex }) {},
    handleEdit(index, row) {},
    handleDelete(index, row) {},
    handleRefer(index, row) {}
  }
}
</script>
