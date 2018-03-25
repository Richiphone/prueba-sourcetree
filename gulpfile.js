var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var runSequence = require('run-sequence');
runSequence.options.ignoreUndefinedTasks = true;

//Tarea para compilar archivos sass a css
gulp.task('sass', function () {
 return gulp.src('./scss/**/*.scss') //Ruta de la carpeta sass apuntando a los archivos `.scss`
  .pipe(sass().on('error', sass.logError)) //Compila los archivos `.scss` y muestra posibles errores
  .pipe(gulp.dest('./css'))//Carpeta donde se guardaran los archivos `.css` compilado
  .pipe(notify("Tarea sass terminada!")); //Mensaje gracias al plugin `gulp-notify`
});


//Tarea para comprimir archivos css
gulp.task('css_mini', function() {
 return gulp.src('css/*.css') //Ruta de la carpeta css apuntando a los archivos `.css`
  .pipe(cleanCSS({compatibility: 'ie8'})) //Comprime los archivos `.css`
  .pipe(gulp.dest('dist')) //Carpeta donde se guardara el archivo `.css` comprimido
  .pipe(notify("Tarea css_mini terminada!")); //Mensaje gracias al plugin `gulp-notify`
});


//Tarea para comprimir archivos js
gulp.task('js_mini', function (cb) {
 pump([
  gulp.src('js/*.js'), //Ruta de la carpeta apuntando a los archivos `.js`
  uglify(), //Comprime los archivos `.js`
  gulp.dest('dist')//Carpeta donde se guardara el archivo `.js` comprimido
   ],
    cb
  );
});

//Tarea para unir ó concatenar archivos
gulp.task('files_add', function() {
 return gulp.src('./css/*.css') //Origen
  .pipe(concat('all.css'))	//Concatenado los archivos 
  .pipe(gulp.dest('./dist/')) //Destino
  .pipe(notify("La tarea files_add a terminado!")); //Mensaje
});

//Vuelve a ejecutar la tarea cuando se modifica algún archivo 
gulp.task('watch', function(){
 gulp.watch('./sass/**/*', ['sass']);
 gulp.watch('./css/**/*', ['css_mini']);
 gulp.watch('./js/**/*', ['js_mini']);
 gulp.watch('./css/**/*', ['files_add']);
});

//Ejecutar todas las tareas
gulp.task('task', function(cb) {
 runSequence('sass', 'css_mini', 'js_mini', 'files_add', null); // no longer errors on `null`
})

//Tarea por defecto
gulp.task('default',['watch', 'sass']);
gulp.task('default',['watch', 'css_mini']);
gulp.task('default',['watch', 'js_mini']);
gulp.task('default',['watch', 'files_add']);