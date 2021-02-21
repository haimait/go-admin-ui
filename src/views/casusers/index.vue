<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="用户名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="" prop="email">
            <el-input
              v-model="queryParams.email"
              placeholder="Email"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <!--          <el-form-item label="对账状态" prop="status">-->
          <!--            <el-select v-model="queryParams.status" placeholder="用户状态" clearable size="small" style="width: 240px">-->
          <!--              <el-option-->
          <!--                v-for="dict in statusOptions"-->
          <!--                :key="dict.dictValue"-->
          <!--                :label="dict.dictLabel"-->
          <!--                :value="dict.dictValue"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="" prop="accountState">
            <el-select
              v-model="queryParams.accountState"
              placeholder="对账状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="(item, index) in accountStateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>

          <!--          <el-form-item label="" prop="isadmin">-->
          <!--            <el-input-->
          <!--              v-model="queryParams.isadmin"-->
          <!--              placeholder="管理员"-->
          <!--              clearable-->
          <!--              size="small"-->
          <!--              @keyup.enter.native="handleQuery"-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:casusers:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:casusers:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:casusers:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="casusersList"
          border
          stripe
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="ID" align="center" prop="ID" :show-overflow-tooltip="true"/>
          <el-table-column label="casUid" align="center" prop="casUid" :show-overflow-tooltip="true" width="80"/>
          <el-table-column label="管理员" align="center" prop="isadmin" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isadmin ==1" type="success" disable-transitions> 是</el-tag>
              <el-tag v-else type="danger" disable-transitions> 否</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="用户名" align="center" prop="username" :show-overflow-tooltip="true"/>
          <el-table-column label="昵称" align="center" prop="nickname" :show-overflow-tooltip="true"/>
          <el-table-column label="Email" align="center" prop="email" :show-overflow-tooltip="true"/>
          <el-table-column label="头像" align="center" prop="avatarMedium" :show-overflow-tooltip="true"/>
          <!--          <el-table-column label="等级" align="center" prop="level" :show-overflow-tooltip="true"/>-->

          <el-table-column label="创建时间" align="center" prop="CreatedAt" width="165">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.CreatedAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" align="center" prop="UpdatedAt" width="165">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.UpdatedAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Key" align="center" prop="key" :show-overflow-tooltip="true"/>
          <el-table-column label="ISVIP1" align="center" prop="isvip" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isvip ==1" type="success" disable-transitions> 是</el-tag>
              <el-tag v-else type="danger" disable-transitions> 否</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="VIP等级" align="center" prop="vipLevel" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.vipLevel ==1">普通会员</span>
              <span v-else-if="scope.row.vipLevel ==2">高级会员</span>
              <span v-else>企业会员</span>
            </template>
          </el-table-column>
          <el-table-column label="F币" align="center" prop="fofaCoin" :show-overflow-tooltip="true"/>
          <el-table-column label="不可提现F币" align="center" prop="onlyPayFofaCoin" :show-overflow-tooltip="true"/>
          <el-table-column label="积分" align="center" prop="point" :show-overflow-tooltip="true"/>
          <el-table-column label="认证" align="center" prop="isAuthenticated" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.isadmin ==1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="对账状态" align="center" prop="accountState" :show-overflow-tooltip="true"/>

          <!--          <el-table-column label="roleId" align="center" prop="roleId" :show-overflow-tooltip="true"/>-->
          <!--          <el-table-column label="F币加密串" align="center" prop="encryptionCoin"  :show-overflow-tooltip="true"/>-->
          <!--          <el-table-column label="" align="center" prop="accountState" :show-overflow-tooltip="true"/>-->
          <el-table-column label="用户类型" align="center" prop="category" :show-overflow-tooltip="true" width="130"/>
          <el-table-column label="会员过期时间" align="center" prop="duration" width="165">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.duration) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="锁定时间" align="center" prop="lockedAt" width="165">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.lockedAt) }}</span>
            </template>
          </el-table-column>
          <!--          <el-table-column label="" align="center" prop="ltime" :show-overflow-tooltip="true"/>-->
          <!--          <el-table-column label="" align="center" prop="loginlog" :show-overflow-tooltip="true"/>-->
          <el-table-column label="管理员等级" align="center" prop="adminlevel" :show-overflow-tooltip="true"/>
          <el-table-column label="限制登陆" align="center" prop="entIpLimit" :show-overflow-tooltip="true"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:casusers:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['admin:casusers:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">

            <el-form-item label="" prop="isadmin">
              <el-radio-group v-model="form.isadmin">
                <el-radio v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictValue">
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="username">
              <el-input v-model="form.username" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="nickname">
              <el-input v-model="form.nickname" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="email">
              <el-input v-model="form.email" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="avatarMedium">
              <el-input v-model="form.avatarMedium" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="level">
              <el-input v-model="form.level" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="key">
              <el-input v-model="form.key" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="isvip">
              <el-input v-model="form.isvip" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="fofaCoin">
              <el-input v-model="form.fofaCoin" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="point">
              <el-input v-model="form.point" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="isAuthenticated">
              <el-input v-model="form.isAuthenticated" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="coinState">
              <el-input v-model="form.coinState" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="vipLevel">
              <el-input v-model="form.vipLevel" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="onlyPayFofaCoin">
              <el-input v-model="form.onlyPayFofaCoin" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="onlyPayCoin">
              <el-input v-model="form.onlyPayCoin" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="roleId">
              <el-input v-model="form.roleId" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="encryptionCoin">
              <el-input v-model="form.encryptionCoin" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="accountState">
              <el-input v-model="form.accountState" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="category">
              <el-input v-model="form.category" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="encryptedPassword">
              <el-input v-model="form.encryptedPassword" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="resetPasswordToken">
              <el-input v-model="form.resetPasswordToken" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="resetPasswordSentAt">
              <el-date-picker v-model="form.resetPasswordSentAt" type="datetime" placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="" prop="rememberCreatedAt">
              <el-date-picker v-model="form.rememberCreatedAt" type="datetime" placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="" prop="signInCount">
              <el-input v-model="form.signInCount" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="currentSignInAt">
              <el-date-picker v-model="form.currentSignInAt" type="datetime" placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="" prop="lastSignInAt">
              <el-date-picker v-model="form.lastSignInAt" type="datetime" placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="" prop="currentSignInIp">
              <el-input v-model="form.currentSignInIp" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="lastSignInIp">
              <el-input v-model="form.lastSignInIp" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="avatarFileName">
              <el-input v-model="form.avatarFileName" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="avatarContentType">
              <el-input v-model="form.avatarContentType" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="avatarFileSize">
              <el-input v-model="form.avatarFileSize" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="avatarUpdatedAt">
              <el-date-picker v-model="form.avatarUpdatedAt" type="datetime" placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="" prop="sashId">
              <el-input v-model="form.sashId" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="duration">
              <el-date-picker v-model="form.duration" type="datetime" placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="" prop="dueTime">
              <el-input v-model="form.dueTime" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="confirmedAt">
              <el-date-picker v-model="form.confirmedAt" type="datetime" placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="" prop="confirmationToken">
              <el-input v-model="form.confirmationToken" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="confirmationSentAt">
              <el-date-picker v-model="form.confirmationSentAt" type="datetime" placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="" prop="unconfirmedEmail">
              <el-input v-model="form.unconfirmedEmail" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="failedAttempts">
              <el-input v-model="form.failedAttempts" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="unlockToken">
              <el-input v-model="form.unlockToken" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="lockedAt">
              <el-date-picker v-model="form.lockedAt" type="datetime" placeholder="选择日期"/>
            </el-form-item>
            <el-form-item label="" prop="ltime">
              <el-input v-model="form.ltime" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="loginlog">
              <el-input v-model="form.loginlog" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="adminlevel">
              <el-input v-model="form.adminlevel" placeholder=""/>
            </el-form-item>
            <el-form-item label="" prop="entIpLimit">
              <el-input v-model="form.entIpLimit" placeholder=""/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <FileChoose ref="fileChoose" :dialog-form-visible="fileOpen" @confirm="getImgList" @close="fileClose"/>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
  import {addCasusers, delCasusers, getCasusers, listCasusers, updateCasusers} from '@/api/casusers'
  import FileChoose from '@/components/FileChoose'

  export default {
    name: 'Casusers',
    components: {
      FileChoose
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 类型数据字典
        typeOptions: [],
        isEdit: false,
        fileOpen: false,
        fileIndex: undefined,
        casusersList: [],
        // 状态数据字典
        statusOptions: [],
        accountStateOptions: [{
          'label': '正常',
          'value': 'success'
        }, {
          'label': '异常',
          'value': 'failure'
        }],
        // 关系表类型

        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
          isadmin: undefined,
          username: undefined,
          nickname: undefined,
          email: undefined

        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          isadmin:
            [
              {required: true, message: '不能为空', trigger: 'blur'}
            ],
          username:
            [
              {required: true, message: '不能为空', trigger: 'blur'}
            ],
          nickname:
            [
              {required: true, message: '不能为空', trigger: 'blur'}
            ],
          email:
            [
              {required: true, message: '不能为空', trigger: 'blur'}
            ]
        }
      }
    },
    created() {
      this.getList()
      this.getDicts('sys_yes_no').then(response => {
        this.typeOptions = response.data
      })
    },
    methods: {
      /** 查询参数列表 */
      getList() {
        this.loading = true
        listCasusers(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.casusersList = response.data.list
            this.total = response.data.count
            this.loading = false
          }
        )
      },
      // 参数系统内置字典翻译
      typeFormat(row, column) {
        return this.selectDictLabel(this.typeOptions, row.configType)
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {

          ID: undefined,
          casUid: undefined,
          isadmin: undefined,
          username: undefined,
          nickname: undefined,
          email: undefined,
          avatarMedium: undefined,
          avatarThumb: undefined,
          level: undefined,
          key: undefined,
          isvip: undefined,
          fofaCoin: undefined,
          point: undefined,
          isAuthenticated: undefined,
          coinState: undefined,
          vipLevel: undefined,
          onlyPayFofaCoin: undefined,
          onlyPayCoin: undefined,
          vipDuration: undefined,
          roleId: undefined,
          encryptionCoin: undefined,
          accountState: undefined,
          category: undefined,
          encryptedPassword: undefined,
          resetPasswordToken: undefined,
          resetPasswordSentAt: undefined,
          rememberCreatedAt: undefined,
          signInCount: undefined,
          currentSignInAt: undefined,
          lastSignInAt: undefined,
          currentSignInIp: undefined,
          lastSignInIp: undefined,
          avatarFileName: undefined,
          avatarContentType: undefined,
          avatarFileSize: undefined,
          avatarUpdatedAt: undefined,
          sashId: undefined,
          duration: undefined,
          dueTime: undefined,
          confirmedAt: undefined,
          confirmationToken: undefined,
          confirmationSentAt: undefined,
          unconfirmedEmail: undefined,
          failedAttempts: undefined,
          unlockToken: undefined,
          lockedAt: undefined,
          ltime: undefined,
          loginlog: undefined,
          adminlevel: undefined,
          entIpLimit: undefined
        }
        this.resetForm('form')
      },
      getImgList: function () {
        this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
      },
      fileClose: function () {
        this.fileOpen = false
      },
      // 关系
      // 文件
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageIndex = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = []
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加fofa用户表'
        this.isEdit = false
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.ID)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const ID =
          row.ID || this.ids
        getCasusers(ID).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改fofa用户表'
          this.isEdit = true
        })
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.ID !== undefined) {
              updateCasusers(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addCasusers(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        var Ids = (row.ID && [row.ID]) || this.ids

        this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delCasusers({'ids': Ids})
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function () {
        })
      }
    }
  }
</script>
