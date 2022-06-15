<template>
  <div class="user-list">
    <div class="user-title">
      用户列表
    </div>
    <div class="user-table">
      <Table stripe :columns="tableColumns" :data="tableData">
        <template slot="footer">
          <Page :total="100" />
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      tableHeight: 500,
      tableColumns: [
        {
          title: 'Name',
          key: 'name',
          width: 160,
        },
        {
          title: 'Age',
          key: 'age',
          width: 100,
        },
        {
          title: 'Province',
          key: 'province',
          width: 100,
        },
        {
          title: 'City',
          key: 'city',
          width: 200,
        },
        {
          title: 'Address',
          key: 'address',
        },
        {
          title: 'Postcode',
          key: 'zip',
          width: 100,
        },
        {
          title: 'Action',
          key: 'action',
          width: 200,
          fixed: 'right',
          render: (h, params) => h('div', [
            h(
              'Button',
              {
                props: {
                  type: 'text',
                  size: 'small',
                },
              },
              'View',
            ),
            h(
              'Button',
              {
                props: {
                  type: 'text',
                  size: 'small',
                },
              },
              'Edit',
            ),
          ]),
        },
      ],
      tableData: [
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          province: 'Canada',
          city: 'Ottawa',
          zip: 100000,
        },
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          province: 'America',
          city: 'New York',
          zip: 100000,
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'Washington, D.C. No. 1 Lake Park',
          province: 'America',
          city: 'Washington, D.C.',
          zip: 100000,
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          province: 'Australian',
          city: 'Sydney',
          zip: 100000,
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          province: 'Canada',
          city: 'Ottawa',
          zip: 100000,
        },
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          province: 'America',
          city: 'New York',
          zip: 100000,
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'Washington, D.C. No. 1 Lake Park',
          province: 'America',
          city: 'Washington, D.C.',
          zip: 100000,
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'Washington, D.C. No. 1 Lake Park',
          province: 'America',
          city: 'Washington, D.C.',
          zip: 100000,
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'Washington, D.C. No. 1 Lake Park',
          province: 'America',
          city: 'Washington, D.C.',
          zip: 100000,
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'Washington, D.C. No. 1 Lake Park',
          province: 'America',
          city: 'Washington, D.C.',
          zip: 100000,
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'Washington, D.C. No. 1 Lake Park',
          province: 'America',
          city: 'Washington, D.C.',
          zip: 100000,
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'Washington, D.C. No. 1 Lake Park',
          province: 'America',
          city: 'Washington, D.C.',
          zip: 100000,
        },
      ],
    };
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  },
};
</script>

<style scoped lang="scss">
.user-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  .user-title {
    font-size: 16px;
    padding-bottom: 6px;
  }
  .user-table {
    flex: 1;
    overflow-y: scroll;
  }
}
</style>
