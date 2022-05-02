from os import walk
import pandas as pd
from pandas import ExcelWriter
from pandas import ExcelFile

TEST = ''

rooms_dict = {}
fullforms = {}
rooms_with_360_images = {}
rooms_to_scope_dict = {}

seasons_fullform = {
  'winter': '1',
  'spring': '2',
  'summer': '3',
  'fall': '4'
}

# helper functions for testing
def print_type_dict(room_source, room_target, type_dict):
    """
    Given a room_target, prints the type and the type dictionary built till
    algorithm is going to process that room.
    Types can be:
        1. Pilot
        2. Ongoing
        3. Completed
        4. Deferred
    Args:
        room_source (str): room var to be compared with
        room_target (str): room we are testing on eg. BA2125
        type_dict (dict): type dictionary to be printed
    """
    if room_source == room_target:
        if 'ongoing' in dirpath.lower():
            print('ongoing:')
        elif 'completed' in dirpath.lower():
            print('completed:')
        elif 'deferred' in dirpath.lower():
            print('deferred:')
        elif 'pilot' in dirpath.lower():
            print('pilot:')
        print(type_dict)

def populate_rooms_to_scope_dict(excel_sheet):
    """
    Reads from an excel sheet and populate rooms_to_scope dictionary.
    rooms_to_scope dictionary has rooms as keys (room ex. BA2155)
    and a list as it's value.

    This list's index corresponds to the column of the excel sheet.
    The list[index] has value 1 when a value is present in the cell.
    It has a value of 0 when value of cell is absent.

    Args:
        excel_sheet (str): excel sheet to interpret information from
    """
    # print(seasons_fullform)
    df = pd.read_excel(excel_sheet , sheet_name='Sheet1')
    columns = list(df.columns)
    for i in range(df.shape[0]):
        row = df.loc[i, : ]

        #removes the space between building name and room number
        key = ('').join(row[0].split(' '))
        # if key=='SS1069':
        # print('key: '+ key)
        if str(row[-1]) == 'nan':
            rooms_to_scope_dict[key] = []
            list_ref = rooms_to_scope_dict[key]

        else:
            if key not in rooms_to_scope_dict:
                rooms_to_scope_dict[key] = {}
            date = str(row[-1])
            if len(date) > 4:
                temp = date.split(' ')[0].split('/')
                date = seasons_fullform[temp[0]] + '/' + seasons_fullform[temp[1]] + '-' + date.split(' ')[1]
                # print('date: ' + date)
                # print(type(rooms_to_scope_dict[key]))
            rooms_to_scope_dict[key][date] = []
            list_ref = rooms_to_scope_dict[key][date]

        for j in range(1, df.shape[1] - 1):
            if str(row[j]) != 'nan':
                list_ref.append(1)
            else:
                list_ref.append(0)

def populate_full_forms(dirpath):
    """
    Populate the fullforms dictionary with building code as keys and building's
    fullform as values.

    Args:
        dirpath (str): the path to the (type) directory i.e Ongoing, Completed
            or Pilot such that parent directory is building directory
    """
    splitted_path = dirpath.split('\\')
    # Building folder format: buidlingcode-fullform eg. MS-Medical Sciences
    building_code = splitted_path[-2].split('-')[0]
    fullform = '-'.join(splitted_path[-2].split('-')[1:])
    fullforms[building_code] = fullform

def populate_rooms_dict(dirpath, filenames):
    """
    Populates the room dictionary which has keys as building code and values as
    type dictionaries. We have 4 types: Pilot, Ongoing, Deffered and Completed.

    Each type dictionary has room number as key and value as a list of time periods.
    A time period represent the period for which the room belongs to that type.
    Time period format: season1/season2-year
    Short forms of seasons are used for reference see seasons_fullform dictionary

    Args:
        dirpath (str): the path to the (type) directory
                       i.e Ongoing, Completed etc
        filenames (list): list of files in the directory
    """
    type_dict = {}

    # Building folder format: buidlingcode-fullform eg. MS-Medical Sciences
    splitted_path = dirpath.split('\\')
    building = splitted_path[-2].split('-')[0]

    # img files format: roomnumber_season1-season2-year
    for pic in filenames:
        if '.jpg' in pic.lower():
            temp = pic.split('_')
            room_number = temp[0]

            temp2 = temp[1].split('-')
            season1 = temp2[0]
            season2 = temp2[1]
            year = temp2[2].split('.')[0]

            #Adding date to list(type_dict[room])
            if room_number not in type_dict:
                type_dict[room_number] = []
            date_to_add = season1 + '/' + season2 + '-' + year
            if date_to_add not in type_dict[room_number]:
                type_dict[room_number].append(date_to_add)

    # type folder is either Ongoing, Completed or Pilot
    type = splitted_path[-1]
    if building not in rooms_dict:
        rooms_dict[building] = {}
    rooms_dict[building][type] = type_dict

def populate_rooms_with_360_images(dirpath, filenames):
    """
    Populate the rooms_with_360_images dictionary with building code as keys
    and value as a list of 360 images.

    Args:
        dirpath (str): the path to the (type) directory i.e Ongoing, Completed
            or Pilot such that parent directory is building directory
    """
    splitted_path = dirpath.split('\\')
    building = splitted_path[-2].split('-')[0]
    for pic in filenames:
        if building not in rooms_with_360_images:
            rooms_with_360_images[building] = []
        rooms_with_360_images[building].append(pic.split('.')[0])

def update_stats(excel_sheet):
    """
    Reads from an excel sheet and update stats in index.html file.
    Stats that are updated are:
        1. Number of Classrooms Renovated
        2. Number of Statkeholders Contacted
        3. Number of Responses

    Args:
        excel_sheet (str): excel sheet to interpret information from
    """
    # Gets the totals from the stats spreadsheet and updates the HTML file with
    # the data
    df = pd.read_excel(excel_sheet, sheet_name='Sheet1')
    columns = list(df.columns)[1:]
    totals = []

    last_index = len(df.index)-1
    for column in columns:
        totals.append(int(df[column][last_index]))

    file_path = './TIL Website/index.html'
    content = ''
    with open(file_path, 'r') as f:
        content = f.read()

    with open(file_path, 'w') as f:
        return_string = ''
        return_string += content[:content.find('data-number') + 13]

        index = 0
        for i in range(3):
            return_string = return_string + str(totals[i]) + "'>" + str(totals[i])

            index = content.find('data-number', index + 1)
            split_string = content[index:]
            end = split_string[13:].find('data-number')
            if (end != -1):
                append_text = split_string[split_string.find('<'):end + 26]
                return_string += append_text
            else:
                return_string += split_string[split_string.find('<'):]
        f.write(return_string)

def main():
    populate_rooms_to_scope_dict('scope.xlsx')
    # print(rooms_to_scope_dict)
    # Gets all the rooms added to the room_images directory
    for (dirpath, dirnames, filenames) in walk('./TIL Website/images/room_images'):
        if not('Before' in dirpath or 'After' in dirpath):
            if 'completed' in dirpath.lower() or 'ongoing' in dirpath.lower() or 'pilot' in dirpath.lower() or 'deferred' in dirpath.lower():
                populate_rooms_dict(dirpath, filenames)
                populate_full_forms(dirpath)

            if '360_images' in dirpath.lower():
                populate_rooms_with_360_images(dirpath, filenames)

    # Updates the JavaScript file with the new data
    with open('./TIL Website/js/rooms_data.js', 'w') as f:
        f.write('var roomsDict = ' + str(rooms_dict) + ';\n\n')
        f.write('var roomsWith360Images = ' + str(rooms_with_360_images) + ';\n\n')
        f.write('var roomsToScopeDict = ' + str(rooms_to_scope_dict) + ';\n\n')
        f.write('var fullform = ' + str(fullforms) + ';\n\n')
        # f.write('var test = '+ str(TEST)+';')

    # Update index.html with stats excel sheet
    update_stats('stats.xlsx')

if __name__ == '__main__':
    main()
