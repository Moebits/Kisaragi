exports.run = async (client: any, message: any, args: string[]) => {
    console.log("here")
    let prefix = await client.fetchPrefix();
    console.log(prefix)
    await client.updatePrefix("g!")
    let prefix2 = await client.fetchPrefix();
    console.log(prefix2)
    await client.updatePrefix("=>")
    let prefix4 = await client.fetchPrefix();
    console.log(prefix4)
}