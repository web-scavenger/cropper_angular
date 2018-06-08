cropperApp.directive('cropper', function cropperFactory(cropperFactory) {

    return {
        restrict: 'E',
        templateUrl: '/app/js/cropper.tpl.html',
        transclude: true,
        scope: {
            ghMode: '@'
        },

        controller: function ($scope, $element) {
            let croper = new cropperFactory();

            let canvas = $element[0].querySelector('.canvas');
            let canvasPreview = $element[0].querySelector('.canvas__preview');
            let addNewImgBtn = $element[0].querySelector('.add__new--img');
            let previewBlock = $element[0].querySelector('.preview__block');

            croper.init(canvas, canvasPreview, addNewImgBtn, previewBlock);

            $scope.backToChange = function () {
                croper.backToChangeFoo(croper.previewBlock);
            }
            $scope.sendRequest = function(){
                croper.sendRequest();
            }

            $scope.cutImage = function () {
                let downlBtn = $element[0].querySelector('.download__btn');
                let mode = $scope.ghMode;
                croper.cutImage(croper.canvasPreview, croper.canvasImgPath, croper.imageName, croper.previewBlock, downlBtn, mode, croper.originalImgHeight);

            }
        }

    }
});
