    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   



/****************************K-MEANS********************************/

   //returns an array of assignments that will be used to color code the polylines in the pc accord to which cluster it belongs 
function kmeans(data, k) {
        
        //1. Randomly place K points into the space represented by the items that are being clustered. These
        //points represent the initial cluster centroids.
		
		

        //2.Assign each item to the cluster that has the closest centroid. There are several ways of calculating
        //distances and in this lab we will use the Euclidean distance:


        //3. When all objects have been assigned, recalculate the positions of the K centroids to be in the
        //centre of the cluster. This is achieved by calculating the average values in all dimensions.


        //4.Check the quality of the cluster. Use the sum of the squared distances within each cluster as your
        //measure of quality. The objective is to minimize the sum of squared errors within each cluster: 
        //where µi is the centroid (mean of the points) of each cluster Si. Iterate (repeat steps 2-4) as long
        //as the quality is improving, once there is no or minimal (less than a threshold) improvement break your algorithm.



        var dim = Object.keys(data[0]);    // in order to know how many cols in first row, dvs dimesnions
		

        var randCentroids = [];            //contains all centroids 

        //set centroids randomly, dvs intitial cluster centroids are created
        // centroids.forEach(function(i){
        //     randClustCentroid(data[i],dim[i]);
        // });
        // varför kan man inte skriva som ovanstående??
        for( var i = 0; i < k; i++){
            randCentroids[i] = randClustCentroid(data, dim);
        }

        //assign item to cluster with closest centroid - use euclidean dist
        var clustIndex = assignCluster(dim, randCentroids, data);

        //Recalculate positions of the centroids to be in center of culster, calc average values in all dim
        var newCentroids = reCalcCluster(dim, clustIndex, randCentroids);
		
		var quality = checkQuality(randCentroids, newCentroids, dim);
	
		var check = 0.000001;
		
		if(quality > check){
			//redo everything
		}
		return clustIndex;
                
};


/****************************FUNCTIONS********************************/

function randClustCentroid(data, dim){
	

    var rand = data[Math.floor(Math.random() * data.length)];    //gets a random data value from the data set
    var rCentroids = [];        //empty array to put centroids in

    for ( var i = 0; i < dim.length; i++){
        rCentroids.push(Number(rand[dim[i]]));        //sends the value in rand to the array
    }

    return rCentroids;
};


//assign a cluster, dvs set points to belong to a certain cluster
function assignCluster(dim, centroids, data){
    // get centroids
    //use euclidean dist to calculate which centroid data is closest
    
    var assClust = [];    
    
    // get data
    data.forEach(function(d, i){
		var min = Infinity;        //wants as big of a number as possible
		var index = -1;
		assClust[i] = {}; // creates an empty col in assClust for each data item
		for(var c = 0; c < centroids.length; c++){
			var dist = eucDist(dim, centroids[c], data);	
			if(dist<min){ 
				min = dist;
				index = c;
			}
		}
		
		if(assClust[i]["index"] == -1 || assClust[i]["index"] == null){
			for(var p = 0; p < dim.length; p++){
				assClust[i][dim[p]] = d[dim[p]];
			}
			assClust[i]["index"] = index;
		}
	
		
    });

	 return assClust;
};

function eucDist(dim, centroid, data){
    //Hittades på https://github.com/harthur/clusterfck/blob/master/lib/distance.js 

    var distance = 0;

    for( var i = 0; i < dim.length; i++){        //behöver ta centroid[dim[i]] för att kunna komma åt alla värden i den
        distance += Math.pow((centroid[dim[i]] - data[dim[i]]), 2);
    }
    //console.log(distance);
   return Math.sqrt(distance);

};

function reCalcCluster(dim, clustIndex, centroids){

    var clust = [];

    //calculate average value of distance in all dimensions 
    centroids.forEach(function (d,i){        //för varje centroid
        var averageDistance = {};        //matrix containing the average distance to a centroid

        for( var i = 0; i < dim.length; i++){    //initiera hela matrisen till nollor
            averageDistance[dim[i]] = 0;
        }

        var n = 0;


        //kolla om samma id
        clustIndex.forEach(function(d){
            if(d.clusterId == i){
                n++;
                for(var j = 0; j < dim.length; j++){
                    averageDistance[dim[j]] += +d[dim[j]];
                }
            }
        })

        //divideringen för att får average
        for( var j = 0; j<dim.length; j++)
            averageDistance[dim[j]] /= n;
        

        clust[i] = averageDistance;

    })


    return clust;
};


function checkQuality(randCent, newCent, dim){
	
	//error = summan av(k) summan av(psom tillhör c) (p-m)^2
	//k = antal clusters
	//c = set of objects in a cluster
	//m = centroid of cluster
	for(var i = 0; i < newCent.length; i++){
		for(var j = 0; j < dim.length; j++){
			var diff = Math.sqrt(Math.pow((randCent[i][dim[j]] - newCent[i][dim[j]]), 2));
		}
	}	
	return diff;
	
};
    
   
    

