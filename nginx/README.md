[comment]: <> (CTRL+SHIFT+V -> Preview markdown in VSCode)
<hr/>
Run next command to start containerwith nginx on port 8080:

    docker run -p 8080:80 nginx_proxy

<br/>
<hr/>
Run next command to start containerwith nginx on port 80:

    docker run -p 80:80 nginx_proxy
<br />
<br />
<hr />
#if Docker container is already created from image, then find id and run it via command docker start

    docker ps -a 
    docker start <container_id>
<br/>
<hr/>

[comment]: <> (TODO: create docker-compose file for running whole system by one command.)