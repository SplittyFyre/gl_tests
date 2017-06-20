#version 410

in vec2 texCoords;
in vec3 fE;
in vec3 fN;
in vec3 fL;
in vec3 fH;
in vec4 fLightSpace;

out vec4 FragColor;

uniform sampler2D texture1;
uniform sampler2D depthMap;

float shadowCalculation(vec4 fLight) {
	float bias = max(0.005 * (1.0 - dot(fN, fL)), 0.0005);
	vec3 projCoords = fLight.xyz/fLight.w;
	projCoords = projCoords * 0.5 + 0.5;
	float closestDepth = texture(depthMap, projCoords.xy).r;
	float currentDepth = projCoords.z;
	float shadow = 0.0;
	vec2 texelSize = 1.0 / textureSize(depthMap, 0);
	for(int x = -1; x <= 1; ++x) {
		for(int y = -1; y <= 1; ++y) {
			float pcfDepth = texture(depthMap, projCoords.xy + vec2(x, y) * texelSize).r;
			shadow += currentDepth - bias > pcfDepth ? 1.0 : 0.0;
		}
	}
	shadow /= 9.0;
	
	if(projCoords.z > 1.0)
		shadow = 0.0;
	return shadow;
}

void main()
{   
	vec4 ambientProduct = vec4(0.2, 0.2, 0.2, 1.0)*vec4(0.2, 0.2, 1.0, 1.0);
	vec4 diffuseProduct = vec4(1.0, 1.0, 1.0, 1.0)*vec4(0.8, 0.8, 0.8, 1.0);
	vec4 specularProduct = vec4(1.0, 1.0, 1.0, 1.0)*vec4(0.5, 0.5, 0.5, 1.0);
	float shininess = 1.0;
	
	float Kd = max(dot(fL, fN), 0.0);
	float Ks = pow(max(dot(fN, fH), 0.0), shininess);
	vec3 color = vec3(texture(texture1, texCoords));
	vec3 ambient = ambientProduct.xyz * color;
	vec3 diffuse = Kd * diffuseProduct.xyz * color;
	vec3 specular = Ks * specularProduct.xyz;
	if(dot(fL, fN) < 0.0) {
		specular = vec3(0.0, 0.0, 0.0);
	}

	float shadow = shadowCalculation(fLightSpace);
	vec3 lighting = (ambient+(1.0-shadow) * (diffuse+specular));
	FragColor = vec4(lighting, 1.0);
}
