// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('PubnubIonicApp', ['ionic', 'pubnub.angular.service'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
	// Hide the accessory bar by default
	//(remove this to show the accessory bar above the keyboard
	// for form inputs)
	if(window.cordova && window.cordova.plugins.Keyboard) {
	    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	}
	if(window.StatusBar) {
	    StatusBar.styleDefault();
	}
    });
})

.controller('SubscribeCtl', function($rootScope, $scope, PubNub) {
    $scope.messages = ['App initialized'];
    $scope.channel = 'beacon';

    if (!$rootScope.initialized) {
	PubNub.init({
	    publish_key: PUBLISH_KEY,
	    subscribe_key: SUBSCRIBE_KEY
	});
	$rootScope.initialized = true;
    };

    PubNub.ngSubscribe({channel: $scope.channel});

    $rootScope.$on(PubNub.ngMsgEv($scope.channel), function(ngEvent, payload) {
	$scope.$apply(function() {
	    $scope.messages.push(payload.message);
	});
	console.log(payload);
    });

    $scope.clear = function() {
	$scope.messages = ['Messages are cleared'];
    };
})
