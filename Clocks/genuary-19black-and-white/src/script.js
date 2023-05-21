RGBA(`

float col(vec2 uv, float d) {
    float e = 0.1, dist;
    vec2 UV = uv;
    uv = fract(uv*4.+time*0.1) - 0.5; 
    dist += sin(UV.y*22. + d + time + log(length(uv)) *8.
        * log(length(uv+UV*2.)));
    
    uv = fract(uv*2.-time*0.1) - 0.5; 
    dist += sin(dist+d-time-length(uv*99.) * log(length(uv)))
        * cos(time);
     
    uv = fract(uv*2.) - 0.5; 
    dist += sin(dist+d+time+length(uv*39.) 
        * log(length(uv)))
        *cos(time*0.7+abs(UV.x)*9.);

    
    return smoothstep(0.5-e, 0.5+e, dist);
}

void main() {
    vec2 uv = gl_FragCoord.xy/resolution.xy-0.5;
    uv.x *= resolution.x/resolution.y;
    
    float aa = 0.0003;
   
    float c;
    c += col(uv+ aa * vec2(-1,-1), 0.);
    c += col(uv+ aa * vec2( 1,-1), 0.);
    c += col(uv+ aa * vec2(-1, 1), 0.);
    c += col(uv+ aa * vec2( 1, 1), 0.);
   
    gl_FragColor = vec4( vec3(c)/4., 1.0);
    
}
`)