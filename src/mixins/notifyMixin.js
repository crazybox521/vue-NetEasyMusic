export default {
    methods: {
        notice() {
            const h = this.$createElement
            this.$notify({
                title: '开发中',
                message: h('i', { style: 'color: teal' }, '加紧完善中')
            })
        }
    },
}