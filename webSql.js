const config = {
  name: 'client',
  version: '1.0',
  desc: 'manage my plans',
  size: 20 * 1024 * 1024,
};

const db = openDatabase(config.name, config.version, config.desc, config.size);

export const getmixins = {
  data() {
    return {
      schoollist: [],
      scenelist: [],
      schoolActive: '',
    };
  },
  computed: {},
  created() {
    this.crateTable();
  },
  methods: {
    crateTable() {
      const sql = 'CREATE TABLE IF NOT EXISTS SCHOOL ( name unique, type, status)';
      const sql1 =
        'CREATE TABLE IF NOT EXISTS SCENE (name, theoryNum , missNum, nopaperNum,actualNum,theoryPaper,batch1,batch2,batch3)';
      db.transaction(tx => {
        tx.executeSql(sql, null, (tx, rs) => {
          console.log('创建sql表成功');
        });
      });
      db.transaction(tx => {
        tx.executeSql(sql1, null, (tx, rs) => {
          console.log('创建sql表成功');
        });
      });
    },
    delSchool(id) {
      const sql = 'DELETE FROM SCHOOL  WHERE rowid=?';
      db.transaction(tx =>
        tx.executeSql(
          sql,
          [id],
          (tx, rs) => {
            const effectRow = rs.rowsAffected;
            console.log(effectRow);
            // effectRow && _this.$message.success('添加学校成功');
          },
          () => {
            // _this.$message.error('添加学校失败');
          },
        ),
      );
    },

    queSchool() {
      this.schoollist = [];
      const sql = 'SELECT * FROM SCHOOL';
      db.transaction(tx =>
        tx.executeSql(
          sql,
          [],
          (tx, rs) => {
            for (let i = 0; i < rs.rows.length; i++) {
              this.schoollist.push(rs.rows.item(i));
            }
            // this.schoollist = rs.rows.item(rs.rows.length);
          },
          () => {
            // this.$message.error('获取学校失败');
          },
        ),
      );
    },
    queScenc(name) {
      this.scenelist = [];
      const schoolActive = localStorage.getItem('schoolActive');
      if (schoolActive === null || schoolActive !== name) {
        localStorage.setItem('schoolActive', name);
      }
      this.schoolActive = schoolActive;
      const sql = 'SELECT * FROM SCENE WHERE name=?';
      db.transaction(tx =>
        tx.executeSql(
          sql,
          [name],
          (tx, rs) => {
            for (let i = 0; i < rs.rows.length; i++) {
              this.scenelist.push(rs.rows.item(i));
              console.log(rs.rows.item(i).rowid);
            }
          },
          (err, rs) => {
            console.log(err, rs);
            this.$message.error('获取考场失败', err);
          },
        ),
      );
    },
    uptScenc(name) {
      const sql = 'UPDATE SCENE SET batch1 =? WHERE rowid=?';
      db.transaction(tx =>
        tx.executeSql(
          sql,
          [10, 1],
          (tx, rs) => {},
          (err, rs) => {
            console.log(err, rs);
            this.$message.error('获取考场失败', err);
          },
        ),
      );
    },
  },
};
export const setmixins = {
  methods: {
    async addScene(name = 'aaa', num = 2) {
      let value = '';
      for (let i = 0; i < num; i++) {
        value += `("${name}", 0, 0, 0, 0, 0, 0, 0, 0)${i === num - 1 ? '' : ','}`;
      }
      const sql = `INSERT INTO SCENE (name, theoryNum , missNum, nopaperNum,actualNum,theoryPaper,batch1,batch2,batch3) VALUES${value}`;
      await db.transaction(async tx => {
        await tx.executeSql(
          sql,
          null,
          async (tx, rs) => {
            const effectRow = rs.rowsAffected;
            this.$message.success('添加考场成功');
            await effectRow;
          },
          err => {
            console.log(err, 'err', sql);
            // this.$message.error('学校已存在');
          },
        );
      });
    },
    async addSchool(values) {
      const sql = 'INSERT INTO SCHOOL (name, type, status) VALUES (?,?,?)';
      await db.transaction(async tx => {
        await tx.executeSql(
          sql,
          values,
          async (tx, rs) => {
            const effectRow = rs.rowsAffected;
            this.$message.success('添加学校成功');
            await effectRow;
          },
          err => {
            console.log(err);
            this.$message.error('学校已存在');
          },
        );
      });
    },
  },
};
