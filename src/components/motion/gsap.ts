"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, Flip, CustomEase, useGSAP);

// One signature curve for the whole site: slow in, decisive out, like a pen stroke.
CustomEase.create("ink", "0.76, 0, 0.24, 1");
CustomEase.create("inkOut", "0.16, 1, 0.3, 1");
gsap.defaults({ ease: "inkOut", duration: 1.1 });

/** Every animation is wrapped in this media query so reduced-motion users get static content. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Flip, useGSAP };
