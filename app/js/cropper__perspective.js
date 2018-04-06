cropperApp.directive('cropper', function (cropperService) {
   
    return {
        restrict: 'E',
        templateUrl: '../app/js/cropper.tpl.html',
        transclude: true,
        scope: {
            mode: '='
        },
        controller: function($scope){
            $scope.sendRequest = function(){
                $scope.$watch("cropper", function() {
                    console.log($scope)
                })        
            }
        
            $scope.uploadNewFile = function(){
                $scope.$watch("cropper", function(){
                    console.log('tetst');
                })
            }

            $scope.cutImage = function(){
                cropperService.cutImage();
            }
        },
        link: function (scope, element, attrs) {
            
            let canvas = element[0].querySelector('.canvas');
            let canvasPreview = element[0].querySelector('.canvas__preview');
            let hiddenCanvas = element[0].querySelector('.hidden__canvas');
            let addNewImgBtn = element[0].querySelector('.add__new--img');

            
            cropperService.init(canvas, canvasPreview, hiddenCanvas, addNewImgBtn);
            
        }
    }
});