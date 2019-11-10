export const toClient = schema => (
    schema.method('toClient', function() {
        const obj = this.toObject();
        obj.id = `${obj._id}`;
        delete obj._id;
        return obj;
    })
)