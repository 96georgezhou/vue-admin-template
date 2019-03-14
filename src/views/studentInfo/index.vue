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
        @click="handleCreate()"
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
      :row-style="tableRowStyle"
      row-class-name="no-hover"
      element-loading-text="Loading"
      border
      fit
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
          <el-button type="success" size="mini" @click="handleEdit(scope.row)">Edit</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">Delete</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item prop="name">
          <label for="nameInput">Name</label>
          <el-input id="nameInput" v-model="temp.name"/>
        </el-form-item>
        <el-form-item prop="schoolName">
          <label for="schoolNameInput">SchoolName</label>
          <el-input id="schoolNameInput" v-model="temp.schoolName"/>
        </el-form-item>
        <el-form-item prop="schoolDistrict">
          <label for="schoolDistrictInput">SchoolDistrict</label>
          <el-input id="schoolDistrictInput" v-model="temp.schoolDistrict"/>
        </el-form-item>
        <el-form-item prop="grade">
          <label for="gradeInput">Grade</label>
          <el-input id="gradeInput" v-model="temp.grade"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.no-hover:hover > td {
  background-color: initial !important;
}
</style>

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
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        id: undefined,
        name: '',
        schoolName: '',
        schoolDistrict: '',
        grade: '',
        refer: ''
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      dialogPvVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
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
          grade: '1',
          refer: false
        },
        {
          id: 2,
          name: 'Sarah',
          schoolName: 'UWB',
          schoolDistrict: 'King County',
          grade: '2',
          refer: false
        },
        {
          id: 3,
          name: 'Donald',
          schoolName: 'UWB',
          schoolDistrict: 'King County',
          grade: '3',
          refer: false
        }
      ]
    }
  },
  created() {
    this.listLoading = false
  },
  methods: {
    createData() {
      this.temp.id = parseInt(Math.random() * 100) + 1024
      this.studentData.push(this.temp)
      this.dialogFormVisible = false
      this.$notify({
        title: 'Success',
        message: 'Successfully Added',
        type: 'success',
        duration: 2000
      })
    },
    updateData() {
      for (let i = 0; i < this.studentData.length; i++) {
        if (this.studentData[i].id === this.temp.id) {
          this.studentData.splice(i, 1)
        }
      }
      this.studentData.push(this.temp)
      this.dialogFormVisible = false
      this.$notify({
        title: 'Success',
        message: 'Successfully Edited',
        type: 'success',
        duration: 2000
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        schoolName: '',
        schoolDistrict: '',
        grade: '',
        refer: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleDelete(id) {
      for (let i = 0; i < this.studentData.length; i++) {
        if (this.studentData[i].id === id) {
          this.studentData.splice(i, 1)
        }
      }
      this.$notify({
        title: 'Success',
        message: 'Successfully Deleted',
        type: 'success',
        duration: 2000
      })
    },
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
    tableRowStyle({ row, rowIndex }) {
      if (row.refer === true) {
        return 'background-color: #909399'
      } else {
        return 'background-color: #FFFFFF'
      }
    },
    handleEdit(row) {
      this.temp = {
        id: row.id,
        name: row.name,
        schoolName: row.schoolName,
        schoolDistrict: row.schoolDistrict,
        grade: row.grade,
        refer: row.refer
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleRefer(index, row) {
      if (row.refer === false) {
        row.refer = true
      } else {
        row.refer = false
      }
    }
  }
}
</script>
