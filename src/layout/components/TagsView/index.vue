<template>
  <div class="tags-view-container">
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
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
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

      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      // 删除时跳转不在停留被删除页
      this.$router.push({ name: activeName })
    },
    tabClick(event) {
      // 写一个点击tabs跳转
      this.$router.push({ name: event.name })
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
</style>
