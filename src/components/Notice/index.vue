<template>
  <div>
    <el-badge :is-dot="true" style="line-height: 25px;margin-top: -5px;" @click.native="dialogTableVisible = true">
      <svg-icon icon-class="通知" />
    </el-badge>

    <el-dialog title="收货地址" :visible.sync="dialogTableVisible" :append-to-body="true">
      <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150" />
        <el-table-column property="name" label="姓名" width="200" />
        <el-table-column property="address" label="地址" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Notice',
  data() {
    return {
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      dialogTableVisible: false
    }
  }
}
</script>

<style scoped>

</style>
