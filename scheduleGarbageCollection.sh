#!/usr/bin/env sh

###########################################################################
# script name: scheduleGarbageCollection.sh                               #
# Fri Feb 13 00:53:30 2015 | 1423806810                                   #
# jtangele@gmail.com                                                      #
#                                                                         #
# schedules time to run garbage collection on a daily basis               #
#                                                                         #
# TO USE:                                                                 #
# change directory to the file with scheduleGarbageCollection.sh          # 
# sh scheduleGarbageCollection.sh                                         #
#                                                                         #
###########################################################################

# USGAGE/HELP MESSAGE
prog=$(basename $0);
help="

${prog} -[h] 

$prog puts a job in cron to execute the garbage collection script on a daily basis.

TO USE:
change directory to the file with scheduleGarbageCollection.sh
and enter the command:
sh scheduleGarbageCollection.sh                               

	-h displays helpful information about $prog
" ;

# SET UP SIMPLE COMMAND LINE FLAGS
while getopts "h" opt ;
do
    case "$opt" in
        h) echo "$help" ;
            exit 0 ;;
        [?])echo "$0: unknown option" >&2 ; #"unknown option" Usage: $0 [-s] [-d seplist] file ..."
            exit 1 ;;
    esac
    shift $OPTIND-1 ;
done

# NON-TEMPLATE / SCRIPT BEGINS

FILE="/tmp/crontab.$$";
NODE=$(which node);
DIR=$(pwd);

while [ -e $FILE ]
do
    PROCNUM=$(echo $FILE | sed ' s/\/tmp\/crontab\.// ' ; );
    PROCNUM=$(( $PROCNUM + 1 ));
    FILE="/tmp/crontab.${PROCNUM}"
done

crontab -l > $FILE

#    min hour mday month wday command  
echo " 0 0 * * * $NODE ${DIR}/garbageCollection.js" >> $FILE

crontab $FILE
rm $FILE
