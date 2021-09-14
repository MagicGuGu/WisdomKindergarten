<template>
  <el-container>
    <div class="title">
      <h1>幼儿园审核</h1>
      <el-divider />
    </div>

    <el-header class="title">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="form.schoolName" placeholder="请输入查询幼儿园名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button class="field btn" type="primary" size="medium" round @click="search">搜索</el-button>
          <el-button class="field btn" type="primary" size="medium" round @click="clearAll">重置</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-divider />

    <el-main class="title">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="schoolName" label="幼儿园名" />
        <el-table-column prop="schoolAddress" label="幼儿园地址" />
        <el-table-column prop="legalPerson" label="法人姓名" />
        <el-table-column prop="legalPersonCard" label="法人身份证号" />
        <el-table-column prop="contactPhone" label="法人联系电话" />
        <el-table-column prop="contactEmail" label="法人联系邮箱" />

        <el-table-column prop="auditId" label="办学许可证">
          <template slot-scope="scope">
            <el-button type="primary" @click="checkImg(scope.schoolPermit)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="auditId" label="卫生许可证">
          <template slot-scope="scope">
            <el-button type="primary" @click="checkImg(scope.sanitaryPermit)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="auditId" label="消防许可证">
          <template slot-scope="scope">
            <el-button type="primary" @click="checkImg(scope.firePermit)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="auditId" label="组织许可证">
          <template slot-scope="scope">
            <el-button type="primary" @click="checkImg(scope.organizationCode)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="auditId" label="税务登记证">
          <template slot-scope="scope">
            <el-button type="primary" @click="checkImg(scope.taxRegistrationCertificate)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatus" :formatter="formatterCheckState" label="状态" />

        <el-table-column prop="auditId" label="操作" width="450px">
          <template slot-scope="scope">

            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确定禁止吗？"
              class="popconfirm"
              @confirm="enterForbid(scope.row)"
            >
              <el-button slot="reference" type="danger" @click="forbid(scope.row)">禁止</el-button>
            </el-popconfirm>

            <el-button type="success" @click="approve(scope.row)">通过</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          layout="prev, pager, next"
          :current-page="currPage"
          :page-size="limit"
          :total="total"
          @current-change="changeCurrPage"
          @prev-click="lastPage"
          @next-click="nextPage"
        />
      </div>
    </el-main>

  </el-container>

</template>
<script>
// import util from '@/util/Util.js'
import { auditSearch, updateAuditState } from '@/api/SchoolAuditApi'

export default ({
  name: 'FileCheckManage',
  data: function() {
    return {
      typeLis: null,
      form: {
        schoolName: ''
      },
      start: 0,
      limit: 5,
      currPage: 1,
      allPage: 1,
      tableData: null,
      total: 0,
      forbidSign: false
    }
  },
  created() {
    // this.init()
  },
  mounted() {
    this.search()
  },
  methods: {
    // 搜索
    search() {
      const loading = this.$loading({
        lock: true,
        text: '加载中....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      auditSearch({
        schoolName: this.form.schoolName,
        start: this.start,
        limit: this.limit
      }).then((resp) => {
        if (resp.id === 200) {
          loading.close()
          this.tableData = resp.datas.auditList
          this.total = resp.datas.num
        }
      }).finally(() => {
        loading.close()
      })
    },
    // 当前页翻页
    changeCurrPage(page) {
      this.start = (page - 1) * this.limit
      this.search()
    },
    // 上一页
    lastPage() {
      this.currPage--
      this.start -= this.limit
      this.search()
    },
    // 下一页
    nextPage() {
      this.currPage++
      this.start += this.limit
      this.search()
    },
    // 重置
    clearAll() {
      this.form.fileName = ''
      this.form.ctime = ''
      this.form.mtime = ''
      this.form.roleId = ''
      this.start = 0
      this.search()
    },
    approve(obj) {
      const auditId = obj.auditId
      updateAuditState({
        auditId: auditId,
        state: 1
      }).then((resp) => {
        if (resp.id === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.start = 0
          this.currPage = 1
          this.search()
        }
      })
    },
    enterForbid(obj) {
      this.forbidSign = true
      this.forbid(obj)
    },
    forbid(obj) {
      const auditId = obj.auditId
      if (this.forbidSign) {
        updateAuditState({
          auditId: auditId,
          state: 2
        }).then((resp) => {
          if (resp.id === 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.start = 0
            this.currPage = 1
            this.search()
            this.forbidSign = false
          }
        })
      }
    },
    checkImg(url) {
      console.log(url)
    },
    formatterCheckState(row, column, cellValue, index) {
      return cellValue === 0 ? '审核中' : cellValue === 1 ? '已禁止' : '已通过'
    }
  }
})
</script>
<style scoped>
.title {
    text-align: center;
  }
  .header{
    display: flex;
    align-items: center;
  }
  .demo-form-inline .el-form-item{
    margin-bottom: 0;
  }
  .el-row {
    margin-bottom: 20px;

    /* &:last-child {
      margin-bottom: 0;
    } */
  }
  .btn {
    margin-left: 10px;
    width: 100px;
  }

  .el-col {
    border-radius: 4px;
  }
  .popconfirm{
    margin-right: 10px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
