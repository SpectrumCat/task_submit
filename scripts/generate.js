function generate_page() {
    /*
    import("./config.js").then(({urls}) => {
        return {
            "datelist_url":urls["datelist_url"],
            "list_url":urls["list_url"],
            "download_url":urls["download_url"],
            "post_url":urls["post_url"]
        };
    });
    */
    var data;
    var a = location.href.substring(35, 45);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urls["list_url"] + a);
    xhr.send();
    xhr.onreadystatechange = function (event) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            data = xhr.response
            if (data != '{}') {
                content = JSON.parse(data)["content"]
                for (index in content) {
                    ele = content[index];
                    listNode = document.getElementById("List");
                    objNode = document.createElement("div");
                    objNode.id = ele["id"];

                    nameNode = document.createElement("span");
                    tNode1 = document.createTextNode(ele["name"]);
                    nameNode.appendChild(tNode1);

                    sepNode = document.createElement("span");
                    tNode2 = document.createTextNode(" | ");
                    sepNode.appendChild(tNode2);

                    statusNode = document.createElement("span");
                    if (ele["finished"]) {
                        s = "Done";
                        statusNode.className = "done";
                    }
                    else {
                        s = "Ongoing";
                        statusNode.className = "ongoing";
                    }
                    tNode3 = document.createTextNode(s);
                    statusNode.appendChild(tNode3);
                    statusNode.id = ele["id"] + "s"

                    discNode = document.createElement("p");
                    tNode4 = document.createTextNode(ele["disc"]);
                    discNode.appendChild(tNode4);

                    inputNode = document.createElement("input");
                    inputNode.type = "file";
                    inputNode.name = "file";
                    document.addEventListener("input", inputChange);

                    sep2Node = document.createElement("p");
                    tNode5 = document.createTextNode("------------------");
                    sep2Node.appendChild(tNode5);

                    objNode.appendChild(nameNode);
                    objNode.appendChild(sepNode);
                    objNode.appendChild(statusNode);
                    objNode.appendChild(discNode);
                    objNode.appendChild(inputNode);
                    if (ele["finished"]) {
                        s = "Done";
                        statusNode.className = "done";
                        downloadNode = document.createElement("a");
                        tNodek = document.createTextNode("报告下载");
                        downloadNode.appendChild(tNodek);
                        downloadNode.href = urls["download_url"] + a + "&name=" + ele["files"];
                        objNode.appendChild(downloadNode);
                    }
                    objNode.appendChild(sep2Node);

                    listNode.appendChild(objNode);
                }
            }
        }
    };
    function inputChange(event) {
        var files = event.target.files[0];
        var formData = new FormData();
        formData.append('file', files);
        formData.append('date', location.href.substring(35, 45));
        formData.append('id', event.target.parentNode.id);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", urls["post_url"], true);
        xhr.send(formData);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                stts = document.getElementById(event.target.parentNode.id + 's');
                stts.innerHTML = "Done";
                stts.className = "done";
                e.value = '';
                location.reload()
            }
        };
    };
}