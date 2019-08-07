exports.run = async (client: any, message: any, args: string[]) => {
    console.log("here")
    let prefix = await client.fetchPrefix();
    console.log(prefix)
    let prefix2 = await client.updatePrefix("g!")
    console.log(prefix2)
    let prefix3 = await client.fetchPrefix();
    console.log(prefix3)
    await client.updatePrefix("=>")
    let prefix4 = await client.fetchPrefix();
    console.log(prefix4)
}