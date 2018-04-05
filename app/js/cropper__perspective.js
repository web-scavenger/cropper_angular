cropperApp.directive('cropper', function (cropperService) {
    return {
        templateUrl: '../app/js/cropper.tpl.html',
        scope: {
            mode: '='
        },
        link: function (scope, element, attrs) {
            cropperService.init();
            
        }
    }
});