<template>
  <div class="tags-view-container">
    <div class="camel-tabs-cntrol">
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="closeCurrentTab">关闭当前标签页</el-dropdown-item>
          <el-dropdown-item @click.native="closeOtherTab">关闭其他标签页</el-dropdown-item>
          <el-dropdown-item @click.native="closeAllTab">关闭所有标签页</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="tabClick($event)">
      <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      />
    </el-tabs>
  </div>
</template>

<script>

export default {
  data() {
    return {
      editableTabsValue: 'index',
      editableTabs: [{
        title: '首页',
        name: 'Dashboard'
      }],
      tabIndex: 1,
      openedTab: ['index']
    }
  },
  watch: {
    $route() {
      this.addTab()
    }
  },
  methods: {
    addTab() {
      const { name, meta } = this.$route
      if (name) {
        const tabs = this.editableTabs
        // 判断tab里是否有相同的,不新加
        if (tabs.some(v => v.name === name)) {
          // 监听activetab以实现点击左侧栏时激活已存在的标签
          if (name !== this.editableTabsValue) {
            this.editableTabsValue = name
          }
          return
        }
        this.editableTabs.push({
          title: meta.title,
          name: name
        })
        this.editableTabsValue = name
      }
      return false
    },
    removeTab(targetName) {
      // 所有tab 名称
      const tabs = this.editableTabs
      // 当前tab 名称
      let activeName = this.editableTabsValue
      if (tabs.length === 1) {
        this.$message.warning(`最少保留一个标签！`)
        return
      } else {
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
      }

      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      // 删除时跳转不在停留被删除页
      this.$router.push({ name: activeName })
    },
    tabClick(event) {
      // 写一个点击tabs跳转
      this.$router.push({ name: event.name })
    },
    closeCurrentTab() {
      if (this.editableTabsValue === 'Dashboard') {
        this.$message.warning(`首页不能移除`)
        return
      }
      this.removeTab(this.editableTabsValue)
    },
    closeOtherTab() {
      const tabs = this.editableTabs
      tabs.forEach(tab => {
        if (tab.name === this.editableTabsValue || tab.name === 'Dashboard') return
        this.removeTab(tab.name)
      })
    },
    closeAllTab() {
      const tabs = this.editableTabs
      tabs.forEach(tab => {
        if (tab.name === 'Dashboard') return
        this.removeTab(tab.name)
      })
    }

  }
}
</script>

<style scoped>
.tags-view-container {
  height: 40px;
  border: none;
  width: 100%;
}
  .camel-tabs-cntrol {
    position: absolute;
    right: 0px;
    width: 40px;
    height: 40px;
    text-align: center;
    cursor: pointer;
    line-height: 40px;
    font-size: 16px;
    border-bottom: 2px solid #f6f6f6;
    border-left: 2px solid #f6f6f6;
  }
.camel-tabs-cntrol:hover {
  background-color: #f6f6f6;
}
</style>
<style>
  #tab-Dashboard{
    font-size: 16px;
  }
  #tab-Dashboard span {
    display: none;
  }
  .el-tabs__header {
    margin-bottom: 0px;
  }
  .el-tabs.el-tabs--card.el-tabs--top {
    margin-right: 40px;
  }
  .el-dropdown {
    font-size: 20px;
  }
</style>
