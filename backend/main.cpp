/**
 * inicio de @systemStar operador central de @BlueStarcompany
 * 
**/ 
#include <iostream>
#include "utils/Config.h"
using namespace std;

int main() {
    Config config;

    config.load("");

    std::cout << "Puerto: " << config.getServerPort() << '\n';
    std::cout << "Log: " << config.getLogLevel() << '\n';

    return 0;
}
