// TODO: Fix dynamic loading of components

import accordian from "./components/accordian";
accordian.init();
import chapterHighlight from "./components/chapterHighlight";
chapterHighlight.init();
import chart from "./components/chart";
chart.init();
import lessonTasks from "./components/lessonTasks";
lessonTasks.init();
import menu from "./components/menu";
menu.init();
import thmList from "./components/thmList";
thmList.init();

/**
 * This is the main entry point for webpack.
 * This file as an "autoloader" for any files placed under the "components/" directory
 * so just create the directory, place any component file in it, and it should be auto bundled.
 * The component file "can" have a default export as an object with a method init() that will be called on page load
 */

// const app = {
//     init() {
//         for (let i in components) {
//             let component = components[i];
//             if (typeof component === 'object' && component.hasOwnProperty('default')) {
//                 component.default.hasOwnProperty('init') ? component.default.init() : null;
//             }
//         }
//     }
// };
// app.init();
