const server = Bun.serve({
    port: 80,
    async fetch(req: Request){
        const url = new URL(req.url).pathname;

        if(url == "/dist/raycast.js")
            return new Response(Bun.file(__dirname + '/../../dist/raycast.js'));

        return new Response(Bun.file(__dirname + ((url == "/") ? '/index.html' : url)));
    },
    error(){
        return new Response("404: File not found.", { status: 404 });
    }
});
  
console.log(`Listening on http://localhost:${server.port} ...`);