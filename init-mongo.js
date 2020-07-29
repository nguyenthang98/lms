db.createUser({
    user: "thang",
    pwd: "example",
    roles: [
        {role: "readWrite", db: "lmsdb"}
    ]
})
