<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input :aria-placeholder="Class" style="width: 600px;" class="filter-item" />
      <el-select clearable style="width: 90px" class="filter-item">
        <el-option/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" >Search</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()" >Add</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" >Export</el-button>
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
      <el-table-column prop="id" align="center" label="Student ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>>
      <el-table-column label="Name" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>>
      <el-table-column label="Grade" prop="grade" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.grade }}</span>
        </template>
      </el-table-column>>
      <el-table-column label="School Name" prop="schoolName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.schoolName }}</span>
        </template>
      </el-table-column>>
      <el-table-column label="School District" prop="schoolDistrict" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.schoolDistrict }}</span>
        </template>
      </el-table-column>>
      <el-table-column label="Test Result" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="navigate">Result</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" size="mini" >Edit</el-button>
          <el-button size="mini" type="danger" @click="deleteRecord(scope.row.id)" >Delete</el-button>
          <el-button size="mini" type="info" >Refer</el-button>
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
    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
    <!--<div class="sub-title">Name</div>-->
    <!--<el-input v-model="temp.name" placeholder="Please enter name" clearable/>-->
    <!--<div class="sub-title">School Name</div>-->
    <!--<el-input v-model="temp.schoolName" placeholder="Please enter school name" clearable/>-->
    <!--<div class="sub-title">School District</div>-->
    <!--<el-input v-model="temp.schoolDistrict" placeholder="Please enter school district" clearable/>-->
    <!--<div class="sub-title">Grade</div>-->
    <!--<el-input v-model="temp.grade" placeholder="Please enter grade" clearable/>-->
    <!--<div class="sub-title">Refer</div>-->
    <!--<el-input v-model="temp.refer" placeholder="Please enter refer status" clearable/>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button @click="dialogFormVisible = false">Cancel</el-button>-->
    <!--<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center = "true">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
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
        <el-button type="primary" @click="createData()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { getList, fetchPv, createArticle, updateArticle } from '@/api/article'
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
        selected: false,
        id: undefined,
        name: '',
        schoolName: '',
        schoolDistrict: '',
        grade: '',
        refer: '',
        test: []
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      list: null,
      selectAll: false,
      dialogPvVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      pvData: [],
      data2: [{
        selected: false,
        id: 1,
        name: 'George',
        schoolName: 'UWB',
        schoolDistrict: 'KingCounty',
        grade: 'gradeOne',
        refer: 'Result',
        test: [1, 2, 3]
      },
      {
        selected: false,
        id: 2,
        name: 'Sarah',
        schoolName: 'UWB',
        schoolDistrict: 'KingCounty',
        grade: 'gradeTwo',
        refer: 'Result',
        test: [1, 2, 3]
      },
      {
        selected: false,
        id: 3,
        name: 'Donald',
        schoolName: 'UWB',
        schoolDistrict: 'KingCounty',
        grade: 'gradeThree',
        refer: 'Result',
        test: [1, 2, 3]
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    createData() {
      this.temp.id = parseInt(Math.random() * 100) + 1024
      this.data2.push(this.temp)
      this.dialogFormVisible = false
      this.$notify({
        title: 'Success',
        message: 'Successfully Added',
        type: 'success',
        duration: 2000
      })
    },
    updateData() {

    },
    resetTemp() {
      this.temp = {
        selected: false,
        id: undefined,
        name: '',
        schoolName: '',
        schoolDistrict: '',
        grade: '',
        refer: '',
        test: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    deleteRecord(id) {
      console.log(id)
      for (let i = 0; i < this.data2.length; i++) {
        if (this.data2[i].id === id) {
          this.data2.splice(i, 1)
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
      this.listLoading = false
    },
    navigate: function() {
      const { query } = this.$route
      // const { path } = params
      this.$router.replace({ path: '/' + 'detailedTable', query })
    }
  }
}

</script>
