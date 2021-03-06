//@auth
//@req(nodeId, port)

import com.hivext.api.development.Scripting;

var envName = '${env.envName}';

var resp = jelastic.env.control.AddEndpoint(envName, session, nodeId, port, "TCP", "Minecraft Server");
if (resp.result != 0) return resp;

var url = "${env.domain}:" + resp.object.publicPort;

resp = jelastic.env.file.ReplaceInBody(envName, session, "/data/web/index.html", "${ENDPOINT_URL}", url, 1, null, "cp", true, nodeId);
if (resp.result != 0) return resp;

var scripting =  hivext.local.exp.wrapRequest(new Scripting({
    serverUrl : "http://" + window.location.host.replace("app", "appstore") + "/"
}));

var text = "Your Minecraft server has been successfully deployed. </br> Please use the following server address to connect your Minecraft client: <a href='tcp://" + url + "'>" + url + "</a>.";
resp = scripting.eval({
    script : "InstallApp",
    targetAppid : '${env.appid}',
    session: session, 
    manifest : {
        "jpsType" : "update",
        "application" : {
		"id": "sendEmail",
		"name": "Minecraft Server",
		"success": {
		        "text": text,
		        "email": text
		}
	}
    }
});

return resp;
