/**
 * Created by John Schroeder on 6/11/2015.
 */

requirejs.config({
    baseUrl: 'public/javascripts',
    paths: {
        app: './imp_scripts'
    }
});

requirejs(['app/nav_vert']);

