#version 410

layout (location = 0) in vec4 vPosition;
layout (location = 1) in vec3 vNormal;
layout (location = 2) in vec2 vTexCoords;
layout (location = 3) in mat4 vInstanceMatrix;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform vec3 cameraPos;

out vec2 fTexCoords;
out vec3 fE;
out vec3 fN;
out vec3 fL;
out vec3 fH;
out vec3 worldPos;

void main()
{	
	gl_Position = vPosition*model*view*projection;
	vec4 ray = normalize(vPosition*model - vec4(cameraPos, 1.0));
	
	mat3 normalMatrix = transpose(inverse(mat3(model)));
	vec4 lightPos = vec4(0.0, 70.0, 0.0, 1.0);
	vec3 lightDir = normalize(vPosition*model - lightPos).xyz;
	fE = normalize(vPosition*model).xyz;
	fN = normalize(vNormal*normalMatrix);
	fL = -normalize(lightDir);
	fH = -normalize(lightDir + ray.xyz);
	
	worldPos = (vPosition*model).xyz;
	
	fTexCoords = vTexCoords;
}