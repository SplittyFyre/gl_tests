#version 410

in vec4 vPosition;
in vec3 vNormal;
in vec2 vTexCoords;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec2 texCoords;
out vec3 fE;
out vec3 fN;
out vec3 fL;
out vec3 fH;

void main()
{	
	gl_Position = vPosition*model*view*projection;
	
	mat3 normalMatrix = transpose(inverse(mat3(model)));
	vec4 lightPos = vec4(0.0, 0.0, 0.0, 1.0);
	vec3 lightDir = -normalize(vPosition*model - lightPos).xyz;
	fE = normalize(vPosition*model).xyz;
	fN = normalize(vNormal*normalMatrix);
	fL = normalize(lightDir);
	fH = normalize(lightDir + (vPosition*model).xyz);
	texCoords = vTexCoords;
	
	//vColor = vec3(1.0, 0.5, 0.2);
}