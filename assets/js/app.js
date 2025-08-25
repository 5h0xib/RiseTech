var app = angular.module('myApp', []);

// Product Controller
app.controller('ProductController', ['$scope', '$http', function ($scope, $http) {
    // Initialize data
    $scope.data = {};
    $scope.searchQuery = '';
    $scope.totalVisibleProducts = 0;


    // Load product data
    $http.get('./assets/js/products.json')
        .then(function (response) {
            $scope.data = response.data;
        }, function (error) {
            console.error("Failed to load data.json", error);
        });

    // Custom filter function for products
    $scope.searchText = function (product) {
        if (!$scope.searchQuery) return true;
        var query = $scope.searchQuery.toLowerCase();
        return (product.name && product.name.toLowerCase().includes(query)) ||
            (product.description && product.description.toLowerCase().includes(query));
    };

    // Check if a brand has visible products
    $scope.hasVisibleBrandProducts = function (products) {
        if (!$scope.searchQuery) return true;
        return products.some($scope.searchText);
    };

    // Check if a category has visible products
    $scope.hasVisibleProducts = function (brands) {
        if (!$scope.searchQuery) return true;
        for (var brand in brands) {
            if ($scope.hasVisibleBrandProducts(brands[brand])) {
                return true;
            }
        }
        return false;
    };

    // Check if any products are visible
    $scope.hasAnyVisibleProducts = function () {
        if (!$scope.searchQuery) return true;
        for (var category in $scope.data) {
            if ($scope.hasVisibleProducts($scope.data[category])) {
                return true;
            }
        }
        return false;
    };

    // Count visible products
    $scope.countVisibleProducts = function () {
        if (!$scope.searchQuery) {
            // Count all products when there's no search
            var count = 0;
            for (var category in $scope.data) {
                for (var brand in $scope.data[category]) {
                    count += $scope.data[category][brand].length;
                }
            }
            return count;
        }

        // Count only visible products during search
        var count = 0;
        for (var category in $scope.data) {
            for (var brand in $scope.data[category]) {
                count += $scope.data[category][brand].filter($scope.searchText).length;
            }
        }
        return count;
    };

    // Watch for search query changes
    $scope.$watch('searchQuery', function () {
        $scope.totalVisibleProducts = $scope.countVisibleProducts();
    });

}]);


// Case Study Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const caseHeaders = document.querySelectorAll('.case-header');
   
    caseHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.case-icon i');
            
            // Toggle active class
            content.classList.toggle('active');
            
            // Change icon
            if (content.classList.contains('active')) {
                icon.classList.remove('bi-caret-down-fill');
                icon.classList.add('bi-caret-up');
            } else {
                icon.classList.remove('bi-caret-up');
                icon.classList.add('bi-caret-down-fill');
            }
        });
    });
});