#version 410

in vec2 fTexCoords;
in vec3 fE;
in vec3 fN;
in vec3 fL;
in vec3 fH;
in vec4 fLightSpace;

out vec4 FragColor;

uniform sampler2D texture1;

void main()
{   
	vec4 ambientProduct = vec4(0.2, 0.2, 0.2, 1.0)*vec4(0.2, 0.2, 1.0, 1.0);
	vec4 diffuseProduct = vec4(1.0, 1.0, 1.0, 1.0)*vec4(0.8, 0.8, 0.8, 1.0);
	vec4 specularProduct = vec4(1.0, 1.0, 1.0, 1.0)*vec4(10.5, 10.5, 10.5, 1.0);
	float shininess = 25.0;
	
	float Kd = max(dot(fL, fN), 0.0);
	float Ks = pow(max(dot(fN, fH), 0.0), shininess);
	//vec3 color = vec3(texture(texture1, fTexCoords));
	vec4 color = vec4(texture(texture1, fTexCoords)).rgba;
	vec4 ambient = vec4(ambientProduct.xyz, 1.0) * color;
	vec4 diffuse = vec4(Kd * diffuseProduct.xyz, 1.0) * color;
	vec4 specular = vec4(Ks * specularProduct.xyz, 1.0);
	if(dot(fL, fN) < 0.0) {
		specular = vec4(0.0, 0.0, 0.0, 1.0);
	}

	//vec3 lighting = (ambient * (diffuse+specular));
	float gamma = 2.2;
	FragColor = vec4(pow(ambient+diffuse+specular, vec4(1.0/gamma)));
}
