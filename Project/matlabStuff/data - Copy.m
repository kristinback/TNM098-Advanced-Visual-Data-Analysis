%%





% NÄSTA GÅNG: 16maj
%Fixa sekvenserna för alla människor, dvs koppla ihop med classificeringen.
%Då kan vi skapa en csv av det och börja med sekvensdiagrammet i
%javascript. Classificeringar som bör vara med: Home, Work, Store, Move

% NÄSTA GÅNG: 17maj
% Fixa vid **************************** skriv till csv


% SEKVENSFIX:
%  fixa classificering genom att först ta ut allas egna hem, hitta de
%  punktenra, ta bort det från alla punnkter, ta bort jobb från alla
%  punkter, clustra resten för att ta reda på affärer och annat, change
%  other to have unique name in personseq and as points. 



%%
%read in data
data = readtable('gps.csv');
data2 = readtable('cc_data.csv');
data3 = readtable('car-assignments.csv');

%%
numberArray = table2array(data(:,2:4));
timeArray = table2array(data(:,1));

expenceTime= table2array(data2(:,1));
expWhere = table2array(data2(:,2));
expWho = table2array(data2(:,4:5));

nameEmp = table2array(data3(1:35,1:2));
idCarEmp = table2array(data3(1:35,3));



%% bilXX = [timestamp, long, lat] för bilen med id XX
cars = cell(35,3);

for i = 1:length(numberArray)
    
    if( numberArray(i,1) <=35 && numberArray(i,1)>=1)
        cars{numberArray(i,1),1}(end+1) = timeArray(i); %timestamp
        cars{numberArray(i,1),2}(end+1) = numberArray(i,2); %long
        cars{numberArray(i,1),3}(end+1) = numberArray(i,3); %lat
    end

end

%% cluster cars, sort out the points of interest

%if D(n,n+1) < minimum_dist, then remove n+1
%Testas genom if (diff>0.0001) då är det en förflyttning 
% locCars = [long, lat, startTime, stopTime]
locCars = cell(35,4); 


%calculate startTime and stopTime
for i = 1:35
    time = cars{i,1}(1);
    for n = 1:length(cars{i,1})
        if (time <= cars{i,1}(n))
            for k = 1:(length(cars{i,1})-n)
                distance = sqrt(((cars{i,2}(n))-(cars{i,2}(n+k)))^2 + ((cars{i,3}(n))-(cars{i,3}(n+k)))^2); 
                if(distance > 0.001 && k > 1)
                    
                   if(diff([cars{i,1}(n), cars{i,1}(n+k-1)])  >  minutes(1) ) 
                    
                       locCars{i,1}(end+1) = cars{i,2}(n);
                       locCars{i,2}(end+1) = cars{i,3}(n);
                       locCars{i,3}(end+1) = cars{i,1}(n);
                       locCars{i,4}(end+1) = cars{i,1}(n+k-1);
                   end
                   time = cars{i,1}(n+k);
                   break;
                end
            end
        end
    end
end

%%
totalTimeLoc = cell(35,3); % long, lat, totTime

for i = 1:35
    totalTimeLoc{i,1}(1) = locCars{i,1}(1);
    totalTimeLoc{i,2}(1) = locCars{i,2}(1);
    totalTimeLoc{i,3}(1) = (locCars{i,4}(1) - locCars{i,3}(1));
    for n = 1:length(locCars{i,1})
        % check if in totalTimeLoc, increase time
       locFound = false; 
       for j = 1:length(totalTimeLoc{i,1})
           distance2 = sqrt(((locCars{i,1}(n))-(totalTimeLoc{i,1}(j)))^2 + ((locCars{i,2}(n))-(totalTimeLoc{i,2}(j)))^2); 
           if (distance2 < 0.001)
               totalTimeLoc{i,3}(j) = totalTimeLoc{i,3}(j) + (locCars{i,4}(n) - locCars{i,3}(n));
               locFound = true;
               break;
           end
       end
       if (locFound == false)
           totalTimeLoc{i,1}(end+1) = locCars{i,1}(n);
           totalTimeLoc{i,2}(end+1) = locCars{i,2}(n);
           totalTimeLoc{i,3}(end+1) = (locCars{i,4}(n) - locCars{i,3}(n));
       end
    end
end

%% compare timestamp i cc_data med om det ligger inuti starttime and endtime
% personSeq = [namn på restaurang, classification of rest, startTime, stopTime]
personSeq = cell(35,4);
for i = 1: length(locCars)     %long,lat,starttime,endtime
    
    nameEmp{i,2};%förnamn
    
    for j=1:length(locCars{i,1})
        % för varje plats vill vi kategorisera
        %kolla om tiden för expence ligger inom startTime och endTime
        %else om det inte gjorts någon expence men
        if (24.879564 < locCars{i,2}(j) && locCars{i,2}(j) < 24.879583 ... % long
                && 36.0479 < locCars{i,1}(j) &&  locCars{i,1}(j) < 36.0491) % lat
            personSeq{i,1}(end+1) = cellstr('GasTech');
            personSeq{i,2}(end+1) = 1;
        else % home or store
            % calc time
            time = hours(0);
            for p = 1:length(totalTimeLoc{i,1})
               distance2 = sqrt(((locCars{i,1}(j))-(totalTimeLoc{i,1}(p)))^2 + ((locCars{i,2}(j))-(totalTimeLoc{i,2}(p)))^2); 
               if (distance2 < 0.001)
                   time = totalTimeLoc{i,3}(p);
                   break;
               end
            end
            
            if( time > hours(100)) % home
                personSeq{i,1}(end+1) = strcat({'Home of '}, nameEmp{i,2});
                personSeq{i,2}(end+1) = 3;
            else % store or other
                for k = 1: length(expenceTime)
                    if (expenceTime(k) > locCars{i,3}(j) && expenceTime(k) < locCars{i,4}(j))
                        %kolla om k är lika med nameEmp(i,2)
                        if(length(expWho{k,1}) == length(nameEmp{i,2}) )
                            if (expWho{k,1} == nameEmp{i,2})
                                %lika med affär
                                personSeq{i,1}(end+1) = strcat({'Store: '}, expWhere{k});
                                personSeq{i,2}(end+1) = 2;
                                break;
                            end
                        end
                        
                    elseif(expenceTime(k)>locCars{i,4}(j))
                        %om man har stannat 
                        personSeq{i,1}(end+1) = cellstr('Other');
                        personSeq{i,2}(end+1) = 4;
                        break;
                    end
                end
            end
                
        end
        
        
        
        %spara startTime och endtime
        personSeq{i,3}(end+1) = locCars{i,3}(j);
        personSeq{i,4}(end+1) = locCars{i,4}(j);
        
    end


    %efternamn
    %&& length(expWho{i,2}) == length(nameEmp{k,1})
    % && expWho{i,2} == nameEmp{k,1}
    
    
end

%%
%figure
for i = 1:25
    plot(locCars{i,2},locCars{i,1}, 'o')
    hold on
end
for i = 1:10
    %plot(cars{i,3},cars{i,2})
    %hold on
end
  %P - dim x Npts array of points.
%         E - Distance threshold.
%    minPts - Minimum number of points required to form a cluster.
%%
plot(locCars{1,2},locCars{1,3},'o')
hold on
plot(cars{1,3},cars{1,1})

%%
locName = cell(1,1);
for i = 1:35
    for j = 1:length(personSeq{i,1})
        locName{1,1}(end+1) = personSeq{i,1}(j);
    end
end
finalName = char(locName{1,1});
%%
long = [];
lat = [];
classification = [];

for i = 1:35
    tempArray = char(personSeq{i,1});
    for j = 1:length(locCars{i,2})
        long(end+1)=locCars{i,2}(j);
        lat(end+1)=locCars{i,1}(j);
        
        %gå igenom expenceTime och klassificera som store eller other
        %beroende på om en transaktion gjorts inom tidsramen. 
%         found = 0;
%         for k = 1:length(expenceTime)
%             if(expenceTime(k) > locCars{i,3}(j) && expenceTime(k) < locCars{i,4}(j))
%                 classification(end+1) = 1;
%                 found = 1;
%                 break;
%             end
%         end
%         if (found == 0)
%             classification(end+1) = 0;
%         end
        classification(end+1) = personSeq{i,2}(j);  %gives same classification as in personSeq
        %locName(end+1) = string(char(personSeq{i,1}(j)));  %gives same classification as in personSeq

    end
end

P = [long; lat];
%% DBSCAN for Points of interest
%[C, ptsC, centroids] = dbscan( [locCars{i,2};locCars{i,1}]', 0.0001, 1);
[C, ptsC, centroids] = dbscan( P, 0.0005, 1);
plot(centroids(2,:), centroids(1,:),'o')

%% loopa igenom centroids och jämför 
centroid_class = [];
centroid_name = cell(1,1);
for i = 1:length(C)
    class1 = sum(classification(C{i}) == 1)/length(C{i});
    class2 = sum(classification(C{i}) == 2)/length(C{i});
    class3 = sum(classification(C{i}) == 3)/length(C{i});
    class4 = sum(classification(C{i}) == 4)/length(C{i});
    if(class1 > 0.7)
        centroid_class(end+1) = 1;
        centroid_name{1,1}(end+1) = cellstr('GasTech');
    elseif(class3 > 0.4)
        centroid_class(end+1) = 3;
        A = unique(locName{1,1}(C{i}),'stable');
        B = cellfun(@(x) sum(ismember(locName{1,1}(C{i}),x)),A,'un',0);
        maxpoint = 0;
        max = 0;
        for j = 1:length(B)
            if(B{j} > max)
                maxpoint = j;
            end
        end
        centroid_name{1,1}(end+1) = cellstr(A{maxpoint});
    elseif(class2 > 0.7)
        centroid_class(end+1) = 2;
        A = unique(locName{1,1}(C{i}),'stable');
        B = cellfun(@(x) sum(ismember(locName{1,1}(C{i}),x)),A,'un',0);
        maxpoint = 0;
        max = 0;
        for j = 1:length(B)
            if(B{j} > max)
                maxpoint = j;
            end
        end
        centroid_name{1,1}(end+1) = cellstr(A{maxpoint});
    else
        centroid_class(end+1) = 4;
        centroid_name{1,1}(end+1) = cellstr('Other');
    end
    
     %  = [centroid_name; finalName(1,:)];
end
csvwrite('centroids.csv',[centroids',centroid_class'],1,0);
%csvwrite('centroids.csv',centroids',1,0);
% A = table(long', lat', locName{1,1}') writetable(A,'test.csv')
%%
finalTableLocations = table(centroid_name{1,1}',centroid_class',centroids');
writetable(finalTableLocations,'centroids3.csv')

%% return files: places, personSeq



% *********************************************** how to fix this
sequenceA = [];
sequenceB = [];
sequenceC = [];
sequenceD = [];
for i = 1:35
    for j = 1:length(personSeq{i,1})
        sequenceA(end+1) = personSeq{i,1}(j);   %cell with chars
        sequenceB(end+1) = personSeq{i,2}(j);   %ints
        sequenceC(end+1) = personSeq{i,3}(j);   %cell with datetime
        sequenceD(end+1) = personSeq{i,4}(j);   %cell with datetime
    end 

end
csvwrite('personSeq.csv',[sequenceA',sequenceB', sequenceC',sequenceD'] ,1,0);
%%
T = cell2table(personSeq);
writetable(T, 'personSeq.dat')
%cell2csv(personSeq);


%%
%gjorde typ transponatet
fid = fopen('csvfilename.csv','w');
for iii=1:length(personSeq)-1,
    maxNRows = max([length(personSeq{iii}) length(personSeq{iii+1})]);
end
for ii=1:maxNRows,  %% 1 -> 47165 rows
    for i=1:length(personSeq), %% 1 -> 26 columns
        try 
            if iscell(personSeq{i}),
                fprintf(fid,'%s,',cell2mat(personSeq{i}(ii)));
            else
                fprintf(fid,'%f,',personSeq{i}(ii));
            end
        catch ME
            fprintf(fid,',');
        end
    end
    fprintf(fid,'\n');
end
fclose(fid);





















%% NOTNOTNOTNOTNOTNOTNOTNOTNOTNOTNOTNOT 
%compare timestamp i cc_data med om det ligger inuti starttime and endtime
% personSeq = [namn på restaurang, classification of rest., startTime, stopTime]
personSeq2 = cell(35,4);
for i = 1: length(expenceTime)
    id = 0;
    for k = 1:length(nameEmp)
        %check name och kolla carsID
        if(length(expWho{i,1}) == length(nameEmp{k,2}) )
            if( expWho{i,1} == nameEmp{k,2} )
                id = k;
            end
        end
        
    end

    %efternamn
    %&& length(expWho{i,2}) == length(nameEmp{k,1})
    % && expWho{i,2} == nameEmp{k,1}
    
    
    if( id ~= 0)  %other wise employe without car
        for j = 1: length(locCars{id,1})
            if( locCars{id,3}(j) < expenceTime(i) && expenceTime(i) < locCars{id,4}(j) )
                personSeq{id,1}(end+1) = 0; %expWhere{i};
                personSeq{id,2}(end+1) = 'a';
                personSeq{id,3}(end+1) = locCars{id,3}(j);
                personSeq{id,4}(end+1) = locCars{id,4}(j);
                break;
            end
        end
    end

    
end






